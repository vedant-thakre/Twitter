import { app } from './app.js';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Server is Live on PORT ${PORT}`.bgMagenta.bold);
})