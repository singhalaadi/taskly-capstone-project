import 'dotenv/config';
import { dbConnect } from './libs/dbConnect.js';

const users = [
    {
        username: "aadi",
        email: "aadi12@gmail.com",
        password: "aadi123",
        avatar: `${process.env.SERVER_URL || 'http://localhost:3000'}/assets/default-user-avatar.png`,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    },
    {
        username: "john",
        email: "john26@gmail.com",
        password: "john123",
        avatar: `${process.env.SERVER_URL || 'http://localhost:3000'}/assets/default-user-avatar.png`,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    },
    {
        username: "jane",
        email: "jane45@gmail.com",
        password: "jane231",
        avatar: `${process.env.SERVER_URL || 'http://localhost:3000'}/assets/default-user-avatar.png`,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    },
    {
        username: "doe",
        email: "doe67@gmail.com",
        password: "doe234",
        avatar: `${process.env.SERVER_URL || 'http://localhost:3000'}/assets/default-user-avatar.png`,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    }
];

// Update tasks in seed.js:
const tasks = [
    {
        title: "Complete project report",
        description: "Finish the final report for the project by end of the week.",
        completed: false,
        priority: "high",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    },
    {
        title: "Prepare presentation slides",
        description: "Create slides for the upcoming presentation next Monday.",
        completed: false,
        priority: "medium",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    },
    {
        title: "Team meeting",
        description: "Schedule a team meeting to discuss project updates.",
        completed: true,
        priority: "low",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
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
        tasks[0].owner = result.insertedIds[1]; // to john
        tasks[1].owner = result.insertedIds[1]; // to john
        tasks[2].owner = result.insertedIds[1]; // to john


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