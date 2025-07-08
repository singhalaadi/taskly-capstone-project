import { dbConnect } from '../libs/dbConnect.js';
import { ObjectId } from 'mongodb';
import { isDemoUser } from '../utils/authHelpers.js';

const db = await dbConnect();
const collection = db.collection('tasks');

// Get all tasks for a user
export const getTasksByUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const query = { owner: new ObjectId(userId) };
        const tasks = await collection.find(query).toArray();
        res.status(200).json({ tasks });
    } catch (error) {
        next({ status: 500, error });
    }
};

// Create a new task
export const createTask = async (req, res, next) => {
    try {
        const { title, description, priority = 'medium', dueDate, completed } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email;

        if (!title) {
            return res.status(400).json({ error: 'Task title is required' });
        }

        const task = {
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            completed: completed || false,
            owner: new ObjectId(userId),
            createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
            updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
            isOriginalDemo: false
        };

        const result = await collection.insertOne(task);
        res.status(201).json({
            message: 'Task created successfully',
            taskId: result.insertedId
        });
    } catch (error) {
        next({ status: 500, error });
    }
};

// Update a task
export const updateTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const updates = req.body;

        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        if (updates.dueDate) {
            updates.dueDate = new Date(updates.dueDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        }

        updates.updatedAt = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        const result = await collection.updateOne(
            {
                _id: new ObjectId(taskId),
                owner: new ObjectId(userId)
            },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        next({ status: 500, error });
    }
};

// Delete a task
export const deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const userEmail = req.user.email;

        // Check if user is a demo user
        if (isDemoUser(userEmail)) {
            const task = await collection.findOne({
                _id: new ObjectId(taskId),
                owner: new ObjectId(userId)
            });

            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            // Prevent deletion if it's an original demo task
            if (task.isOriginalDemo) {
                return res.status(403).json({
                    error: 'Demo users cannot delete original demo tasks',
                    isDemoUser: true,
                    message: 'Demo users can only delete tasks they create themselves'
                });
            }
        }

        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const result = await collection.deleteOne({
            _id: new ObjectId(taskId),
            owner: new ObjectId(userId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next({ status: 500, error });
    }
};

// Get a single task
export const getTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const userEmail = req.user.email;

        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const task = await collection.findOne({
            _id: new ObjectId(taskId),
            owner: new ObjectId(userId)
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Include information about whether this is a demo user
        const responseData = {
            task,
            userInfo: {
                isDemoUser: isDemoUser(userEmail)
            }
        };

        res.status(200).json(responseData);
    } catch (error) {
        next({ status: 500, error });
    }
};
