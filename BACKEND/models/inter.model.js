import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },

  answer: {
    type: String,
    default: "",
  },

  feedback: {
    type: String,
    default: "",
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },

  questionType: {
    type: String,
    enum: ["HR", "Technical", "DSA", "System Design"],
    required: true,
  },

  timeLimit: {
    type: Number,
    default: 60,
  },

  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  communication: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  correctness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      enum: [
        "HR",
        "Technical",
        "DSA",
        "System Design",
        "Mixed",
      ],
      required: true,
    },

    mode: {
      type: String,
      enum: [
        "HR",
        "Technical",
        "DSA",
        "System Design",
      ],
      required: true,
    },

    resumeScore: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    finalScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Started",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model(
  "Interview",
  interviewSchema
);

export default Interview;