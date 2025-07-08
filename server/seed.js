// DEMO DATA ONLY - NOT REAL USERS OR PASSWORDS
// This file contains sample data for demonstration purposes only
import 'dotenv/config';
import { dbConnect } from './libs/dbConnect.js';

const users = [
    {
        username: "demoUser",
        email: "demoUser@example.com",
        password: "demoUserPass",
        avatar: `https://taskzy-production.up.railway.app/assets/default-user-avatar.png`,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    },
    {
        username: "demo1",
        email: "demo1@example.com",
        password: "demo456",
        avatar: `https://taskzy-production.up.railway.app/assets/default-user-avatar.png`,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    }
];

// Update tasks in seed.js:
const tasks = [
    {
        title: "Demo Task: Complete project report",
        description: "Finish the final report for the project by end of the week.",
        completed: false,
        priority: "high",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        isOriginalDemo: true 
    },
    {
        title: "Demo Task: Prepare presentation slides",
        description: "Create slides for the upcoming presentation next Monday.",
        completed: false,
        priority: "medium",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        isOriginalDemo: true
    },
    {
        title: "Demo Task: Team meeting",
        description: "Schedule a team meeting to discuss project updates.",
        completed: true,
        priority: "low",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        isOriginalDemo: true  
    }
];

// Main seeding function
async function seedDatabase() {
    try {
        const db = await dbConnect();

        // Clear existing data
        await db.collection('users').deleteMany({});
        await db.collection('tasks').deleteMany({});

        // Seeding Users
        let collection = db.collection('users');
        console.log('[seed]', 'Seeding Users...');
        const result = await collection.insertMany(users);
        console.log('[seed]', 'Inserted user IDs:', result.insertedIds);
        console.log('[seed]', 'Seeding Users Done');

        // Seeding Tasks
        tasks[0].owner = result.insertedIds[0]; // to demoUser
        tasks[1].owner = result.insertedIds[0]; // to demoUser
        tasks[2].owner = result.insertedIds[0]; // to demoUser


        collection = db.collection('tasks');
        console.log('[seed]', 'Seeding Tasks...');
        const taskResult = await collection.insertMany(tasks);
        console.log('[seed]', 'Inserted task IDs:', taskResult.insertedIds);
        console.log('[seed]', 'Seeding Tasks Done');

        console.log('[seed]', 'All Done');
    } catch (error) {
        console.log('[seed]', 'Error:', error);
    } finally {
        process.exit();
    }
}

// Run the seeding
seedDatabase();
