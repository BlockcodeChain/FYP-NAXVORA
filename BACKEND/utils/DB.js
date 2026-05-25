import mongoose from 'mongoose'

const ConnectDB =async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL,)
        console.log("MONGODB_URL =", process.env.MONGODB_URL);
        console.log("MongoDB connected successfully ✅");
    } catch (error) {
        console.log("MongoDB connection failed ❌:",error.message,error);
        process.exit(1);
    }
}
export default ConnectDB;
