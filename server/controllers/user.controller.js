import { ObjectId } from 'mongodb';
import { dbConnect } from '../libs/dbConnect.js';
import bcrypt from 'bcrypt';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const db = await dbConnect();
        const collection = db.collection('users');
        const users = await collection.find({}).toArray();
        
        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        
        res.status(200).json(usersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single user
export const getUser = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        const db = await dbConnect();
        const collection = db.collection('users');
        const user = await collection.findOne({ _id: new ObjectId(req.params.id) });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create user
export const createUser = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;
        
        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        
        const db = await dbConnect();
        const collection = db.collection('users');
        
        // Check if user already exists
        const existingUser = await collection.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            username,
            email,
            password: hashedPassword,
            avatar: avatar || '/assets/default-user-avatar.png',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const result = await collection.insertOne(newUser);
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ _id: result.insertedId, ...userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        // Check if req.body exists and has data
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'No data provided for update' });
        }
        
        const db = await dbConnect();
        const collection = db.collection('users');
        
        // Hash password only if it exists and is provided
        if (req.body.password && req.body.password.trim() !== '') {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        
        const updatedUser = {
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedUser }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        const db = await dbConnect();
        const collection = db.collection('users');
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};