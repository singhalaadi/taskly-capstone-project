import express from 'express';
import 'dotenv/config';
import { dbConnect } from './libs/dbConnect.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to the server!'});
});

app.use((req, res) => {
    res.status(404).send({message: 'Not Found'});
});

app.listen(PORT, async () => {
    try {
        await dbConnect();
        console.log(`Server is running on port ${PORT}`);
        console.log(`You can check here: http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
    }
});