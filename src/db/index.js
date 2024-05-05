import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () => {
    console.log(process.env.MONGODB_URI, DB_NAME)
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`MongoDB Connected ! DB HOST: ${connectionInstance.connection.host}`
    );
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR: ", error);
        throw error;
    }
}

export default connectDB;