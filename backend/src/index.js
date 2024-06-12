import { app } from './app.js';
import dotenv from 'dotenv';
import colors from 'colors';
import { connectDB } from './db/db.js';

dotenv.config();
const PORT = process.env.PORT || 5050;

connectDB();
app.listen(PORT, () => {
    console.log(`Server is Live on PORT ${PORT}`.yellow.bold);
})