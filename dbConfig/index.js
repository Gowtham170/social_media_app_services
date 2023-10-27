import mongoose from 'mongoose';
import dotenv from 'dotenv';

const dbConnetion = async () => {
    try {

        dotenv.config();
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('DB Connected Successfully');
    } catch (error) {
        console.log(`DB Error: ${error}`);
    }
}

export default dbConnetion;