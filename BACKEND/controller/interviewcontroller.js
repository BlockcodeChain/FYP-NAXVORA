import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askai } from "../services/openRouter.service.js";
import Interview from "../models/inter.model.js";


// ================= SAFE JSON PARSER =================
const safeJSONParse = (text) => {
  try {
    if (!text) return null;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.log("❌ JSON PARSE ERROR:", err);
    return null;
  }
};


// ================= PDF EXTRACTOR =================
const extractPDFText = async (filePath) => {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      text += content.items.map((item) => item.str).join(" ") + " ";
    }

    return text
      .replace(/\s+/g, " ")
      .replace(/[^\x20-\x7E]/g, "")
      .trim()
      .slice(0, 12000);

  } catch (err) {
    console.log("❌ PDF ERROR:", err);
    return "";
  }
};


// ================= ANALYZE RESUME (PRO VERSION) =================
export const analyzeResume = async (req, res) => {
  let filePath = "";

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required",
      });
    }

    filePath = req.file.path;

    const resumeText = await extractPDFText(filePath);

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract resume text",
      });
    }

    const aiResponse = await askai([
      {
        role: "system",
        content: `
You are a senior FAANG recruiter + ATS system.

Return ONLY valid JSON:

{
  "name": "",
  "role": "",
  "skills": [],
  "experience": "",
  "education": "",
  "projects": [
    {
      "title": "",
      "description": ""
    }
  ],
  "summary": "",
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Rules:
- score must be 0 to 100
- skills must be short keywords only
- projects must be structured objects
- NO markdown, NO explanation, ONLY JSON
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ]);

    const parsed = safeJSONParse(aiResponse);

    if (!parsed) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }

    // ================= CLEAN RESPONSE =================
    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",

      analysis: {
        personal: {
          name: parsed.name || "",
          role: parsed.role || "",
          experience: parsed.experience || "",
          education: parsed.education || "",
        },

        skills: Array.isArray(parsed.skills) ? parsed.skills : [],

        projects: Array.isArray(parsed.projects)
          ? parsed.projects
          : [],

        insights: {
          summary: parsed.summary || "",
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          suggestions: parsed.suggestions || [],
        },

        score: parsed.score || 0,
      },

      resumeText,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
      error: error.message,
    });

  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};


// ================= GENERATE QUESTIONS =================
export const generateQuestion = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!user.credits && user.credits !== 0) {
      user.credits = 100;
      await user.save();
    }

    const {
      role,
      experience,
      mode,
      resumeText,
      skills,
      projects,
    } = req.body;

    if (!role || !experience || !mode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const validModes = ["HR", "Technical", "DSA", "System Design"];

    if (!validModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mode",
      });
    }

    const COST = 50;

    if (user.credits < COST) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits",
      });
    }

    // ================= SAFE FIX (ONLY ADDITION) =================
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeResume = typeof resumeText === "string" ? resumeText : "";

    const aiResponse = await askai([
      {
        role: "system",
        content: `
You are FAANG interviewer.

Return ONLY JSON:
{
  "questions": [
    {
      "question": "",
      "questionType": "",
      "difficulty": "Easy",
      "timeLimit": 120
    }
  ]
}

Rules:
- exactly 7 questions
- real interview tone
        `,
      },
      {
        role: "user",
        content: `
Role: ${role}
Experience: ${experience}
Mode: ${mode}
Skills: ${safeSkills.join(", ")}
Projects: ${safeProjects.map(p => p.title || p).join(", ")}
Resume: ${safeResume.slice(0, 8000) || "No resume provided"}
        `,
      },
    ]);

    const parsed = safeJSONParse(aiResponse);

    if (!parsed?.questions?.length) {
      return res.status(500).json({
        success: false,
        message: "Question generation failed",
      });
    }

    const questions = parsed.questions.slice(0, 7).map((q, i) => ({
      question: q.question,
      difficulty: ["Easy", "Easy", "Medium", "Medium", "Medium", "Hard", "Hard"][i],
      questionType: q.questionType || mode,
      timeLimit: q.timeLimit || 120,
      answer: "",
      feedback: "",
      score: 0,
      isAnswered: false,
    }));

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      interviewType: mode,
      mode,
      skills: safeSkills,
      summary: safeResume,
      questions,
      startedAt: new Date(),
      status: "Pending",
      totalQuestions: questions.length,
      completedQuestions: 0,
      finalScore: 0,
    });

    user.credits -= COST;
    await user.save();

    return res.status(200).json({
      success: true,
      interviewId: interview._id,
      questions,
      remainingCredits: user.credits,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= SUBMIT ANSWER =================
export const submitAnswer = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false });
    }

    const { interviewId, questionIndex, answer } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ success: false });
    }

    const question = interview.questions?.[questionIndex];

    if (!question) {
      return res.status(400).json({ success: false });
    }

    if (question.isAnswered) {
      return res.status(400).json({
        success: false,
        message: "Already answered",
      });
    }

    const elapsed = Math.floor(
      (Date.now() - new Date(interview.startedAt).getTime()) / 1000
    );

    if (elapsed > (question.timeLimit || 120)) {
      question.answer = "TIME EXPIRED";
      question.score = 0;
      question.isAnswered = true;

      await interview.save();

      return res.json({
        success: true,
        message: "Time expired",
        score: 0,
      });
    }

    if (!answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Empty answer",
      });
    }

    const aiResponse = await askai([
      {
        role: "system",
        content: `
Return JSON:
{
  "score": 0,
  "feedback": "",
  "confidence": 0,
  "correctness": 0
}
        `,
      },
      {
        role: "user",
        content: `Q: ${question.question}\nA: ${answer}`,
      },
    ]);

    const evalData = safeJSONParse(aiResponse);

    question.answer = answer;
    question.feedback = evalData?.feedback || "";
    question.score = evalData?.score || 0;
    question.isAnswered = true;

    const total = interview.questions.reduce((a, b) => a + (b.score || 0), 0);
    const answered = interview.questions.filter(q => q.isAnswered).length;

    interview.finalScore = answered ? Math.round(total / answered) : 0;
    interview.completedQuestions = answered;

    if (answered === interview.questions.length) {
      interview.status = "Completed";
    }

    await interview.save();

    return res.json({
      success: true,
      evaluation: evalData,
      finalScore: interview.finalScore,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= FINISH INTERVIEW =================
export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ success: false });
    }

    const answered = interview.questions.filter(q => q.isAnswered).length;

    const totalScore = interview.questions.reduce(
      (a, b) => a + (b.score || 0),
      0
    );

    const finalScore = answered
      ? Math.round(totalScore / answered)
      : 0;

    interview.finalScore = finalScore;
    interview.status = "Completed";
    interview.endedAt = new Date();

    await interview.save();

    return res.json({
      success: true,
      finalScore,
      answered,
      total: interview.questions.length,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInterviewHistory =
async (req, res) => {

  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
      });
    }

    const history =
      await Interview.find({
        userId: user._id,
        status: "Completed",
      })
        .sort({
          createdAt: -1,
        })
        .select(
          `
          role
          mode
          finalScore
          questions
          createdAt
          experience
          `
        );

    return res.status(200).json({
      success: true,
      history,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};