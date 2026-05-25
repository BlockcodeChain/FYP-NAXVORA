import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import interviewrouter from "./routes/interview.route.js";
import ConnectDB from "./utils/DB.js";
import authRoute from "./routes/authroute.js";
import userRoute from "./routes/user.route.js";
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 8000;

/* ================= MIDDLEWARE ================= */

// JSON parser
app.use(express.json());

// Cookie parser (must before routes)
app.use(cookieParser());

// CORS (must before routes)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ================= ROUTES ================= */

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/interview",interviewrouter)
/* ================= START SERVER ================= */

const startServer = async () => {
  try {
    await ConnectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1);
  }
};

startServer();