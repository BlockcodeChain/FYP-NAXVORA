import express from "express";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

import {
  analyzeResume,
  generateQuestion,
  submitAnswer,
  finishInterview,
  getInterviewHistory,
} from "../controller/interviewcontroller.js";

const interviewrouter = express.Router();

// ================= RESUME =================
interviewrouter.post(
  "/analyze-resume",
  upload.single("resume"),
  isAuth,
  analyzeResume
);

// ================= INTERVIEW =================
interviewrouter.post("/generateQuestion", isAuth, generateQuestion);
interviewrouter.post("/submit-answer", isAuth, submitAnswer);
interviewrouter.post("/finish", isAuth, finishInterview);

// ================= HISTORY (FIXED CLEAN ROUTE) =================
interviewrouter.get("/history", isAuth, getInterviewHistory);

export default interviewrouter;