import jwt from 'jsonwebtoken';
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

// Register user with JWT token
export const register = async (req, res, next) => {
    try {
        const { username, email, password, avatar } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const db = await dbConnect();
        const collection = db.collection('users');

        // Check if user already exists
        const existingUser = await collection.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(422).json({ error: 'Email or Username is already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            avatar: avatar || `${process.env.SERVER_URL || 'http://localhost:3000'}/assets/default-user-avatar.png`,
            createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
            updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        };

        const result = await collection.insertOne(newUser);

        // Generate JWT token
        const token = jwt.sign(
            {
                id: result.insertedId,
                email: email,
                username: username
            },
            process.env.AUTH_SECRET || 'your-fallback-secret-key',
            { expiresIn: '7d' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        res
            .cookie('taskzy_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .status(201)
            .json({
                message: 'User registered successfully',
                user: { _id: result.insertedId, ...userWithoutPassword },
                token: token 
            });

    } catch (error) {
        console.error('Registration error:', error);
        next({ status: 500, error: error.message });
    }
};

// Login user
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await dbConnect();
        const collection = db.collection('users');

        const user = await collection.findOne({ email });

        if (user) {
            console.log('User email in DB:', user.email);
            console.log('User password in DB:', user.password);
            console.log('Password is hashed:', user.password.startsWith('$2b$'));
        }

        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if password is already hashed or plain text (for demo users)
        let isPasswordValid = false;

        if (user.password.startsWith('$2b$')) {
            // Password is hashed, use bcrypt compare
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Password is plain text
            isPasswordValid = password === user.password;
        }

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username
            },
            process.env.AUTH_SECRET || 'your-fallback-secret-key',
            { expiresIn: '7d' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res
            .cookie('taskzy_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .status(200)
            .json({
                message: 'Login successful',
                user: userWithoutPassword,
                token: token
            });

    } catch (error) {
        console.error('Login error:', error);
        next({ status: 500, error: error.message });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        res
            .clearCookie('taskzy_token')
            .status(200)
            .json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
export const updateUser = async (req, res, next) => {
    // Check if user is trying to update their own account
    if (req.user.id !== req.params.id) {
        return next({
            status: 401,
            message: 'You can only update your own account',
        });
    }

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
            req.body.password = await bcrypt.hash(req.body.password, 12);
        }

        const updatedUser = {
            ...req.body,
            updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
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
        next({ status: 500, error: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    // Check if user is trying to delete their own account
    if (req.user.id !== req.params.id) {
        return next({
            status: 401,
            message: 'You can only delete your own account',
        });
    }

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
        console.error('Delete error:', error);
        next({ status: 500, error: error.message });
    }
};