import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);


export const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("DB Connected");
        });
    };