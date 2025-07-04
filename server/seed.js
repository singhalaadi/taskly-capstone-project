import 'dotenv/config';
import { dbConnect } from './libs/dbConnect.js';

const users = [
    {
        username: "aadi",
        email: "aadi12@gmail.com",
        password: "aadi123",
        avatar: '/assets/default-user-avatar.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: "john",
        email: "john26@gmail.com",
        password: "john123",
        avatar: '/assets/default-user-avatar.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: "jane",
        email: "jane45@gmail.com",
        password: "jane231",
        avatar: '/assets/default-user-avatar.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: "doe",
        email: "doe67@gmail.com",
        password: "doe234",
        avatar: '/assets/default-user-avatar.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

const tasks = [
    {
        title: "Complete project report",
        description: "Finish the final report for the project by end of the week.",
        status: "in-progress",
        priority: "high",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        title: "Prepare presentation slides",
        description: "Create slides for the upcoming presentation next Monday.",
        status: "pending",
        priority: "medium",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        title: "Team meeting",
        description: "Schedule a team meeting to discuss project updates.",
        status: "completed",
        priority: "low",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

// Main seeding function
async function seedDatabase() {
    try {
        const db = await dbConnect();
        
        // Clear existing data
        // await db.collection('users').deleteMany({});
        // await db.collection('tasks').deleteMany({});
        
        // Seeding Users
        let collection = db.collection('users');
        console.log('[seed]', 'Seeding Users...');
        const result = await collection.insertMany(users);
        console.log('[seed]', 'Inserted user IDs:', result.insertedIds);
        console.log('[seed]', 'Seeding Users Done');
        
        // Seeding Tasks
        tasks[0].owner = result.insertedIds[0];
        tasks[1].owner = result.insertedIds[1];
        tasks[2].owner = result.insertedIds[2];
        
        collection = db.collection('tasks');
        console.log('[seed]', 'Seeding Tasks...');
        const taskResult = await collection.insertMany(tasks);
        console.log('[seed]', 'Inserted task IDs:', taskResult.insertedIds);
        console.log('[seed]', 'Seeding Tasks Done');
        
        console.log('[seed]', 'All Done ✅');
    } catch (error) {
        console.log('[seed]', 'Error:', error);
    } finally {
        process.exit();
    }
}

// Run the seeding
seedDatabase();