import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const {MONGODB_URI, MONGODB_DATABASE} = process.env;
const client= new MongoClient(MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
export const dbConnect = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(MONGODB_DATABASE);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
export const closeDbConnection = async () => {
    try {
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
};
