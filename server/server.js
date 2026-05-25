import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import ConnectDB from "./utils/DB.js";
import authRoute from "./routes/authroute.js";
import userRoute from "./routes/user.route.js";
import interviewrouter from "./routes/interview.route.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 8000;

/* ================= DATABASE ================= */
ConnectDB();

/* ================= MIDDLEWARE ================= */

// JSON body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

/* ================= CORS FIX (PRODUCTION SAFE) ================= */

const allowedOrigins = [
  "https://fyp-nexvoraai.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow postman / server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// IMPORTANT: DO NOT use app.options("*")

/* ================= ROUTES ================= */

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/interview", interviewrouter);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("🚀 Nexvora AI Server Running");
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});