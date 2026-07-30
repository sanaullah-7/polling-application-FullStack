import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { verifyEmailSetup } from "./config/mailer.js";
import authRouter from "./routes/authRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import pollRouter from "./routes/pollRoutes.js";
import commentRouter from "./routes/commentRoute.js";
import userRouter from "./routes/userRoutes.js";
// dotenv.config();

const PORT =  process.env.PORT || 5000;
const app = express(); // This middleware reads JSON data sent by the client.

// MIDDLEWARE
app.use(cors({  
    origin:"*",
    credentials:true
 }
));

app.use(express.json());

// DB
connectDB();
verifyEmailSetup();


// ROUTES for server
app.use("/api/auth", authRouter);
app.use("/api/polls", pollRouter)
app.use("/api/comments", commentRouter)
app.use("/api/users", userRouter)
app.use("/api/notification", notificationRouter)

app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.listen(PORT, () => {
    console.log(`Server Started on http://localhost:${PORT}`);
});
