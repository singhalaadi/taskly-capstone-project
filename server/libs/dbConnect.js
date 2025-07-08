import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "taskzy";

        // Check if connection string exists
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const client = new MongoClient(MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(MONGODB_DATABASE);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export const closeDbConnection = async (client) => {
    if (!client) return;
    try {
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
};
