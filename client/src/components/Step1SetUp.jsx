import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import {
  BsUpload,
  BsArrowRight,
  BsFileEarmarkPdfFill,
  BsStarFill,
  BsCheckCircleFill,
} from "react-icons/bs";

const  SERVER_URL = import.meta.env.VITE_API_URL;

const Step1SetUp = ({ onStart }) => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");

  const [resume, setResume] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // ================= RESUME UPLOAD =================
  const handleResumeUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF allowed ❌");
      return;
    }

    setResume(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        `${SERVER_URL}/api/interview/analyze-resume`,
        formData,
        { withCredentials: true }
      );

      if (res.data?.success) {
        const data = res.data.analysis;

        setResumeAnalysis(data);

        setRole(data?.personal?.role || "");
        setExperience(data?.personal?.experience || "");

        toast.success("Resume analyzed successfully 🚀");
      } else {
        toast.error("Analysis failed ❌");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // ================= START INTERVIEW =================
  const handleStart = async () => {
    if (starting) return;

    if (!role.trim() || !experience.trim()) {
      toast.error("Role & Experience required");
      return;
    }

    if ((userData?.credits ?? 0) < 50) {
      toast.error("Not enough credits (50 required)");
      return;
    }

    setStarting(true);

    try {
      const payload = {
        role,
        experience,
        mode: interviewType,
        resumeText: resumeAnalysis?.resumeText || "",
        skills: resumeAnalysis?.skills || [],
        projects: resumeAnalysis?.projects || [],
      };

      const res = await axios.post(
        `${SERVER_URL}/api/interview/generateQuestion`,
        payload,
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success("Interview Started 🚀");

        const remaining = res.data?.remainingCredits;

        if (typeof remaining === "number") {
          dispatch({
            type: "UPDATE_CREDITS",
            payload: remaining,
          });
        }

        onStart({
          interviewId: res.data.interviewId,
          questions: res.data.questions,
          role,
          experience,
          interviewType,
          resumeAnalysis,
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error");
    } finally {
      setStarting(false);
    }
  };

  const safeProjects = resumeAnalysis?.projects || [];
  const safeSkills = resumeAnalysis?.skills || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] to-[#030712] text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6">

        {/* ================= LEFT PANEL ================= */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 space-y-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl"
        >

          <h1 className="text-3xl font-bold">
            AI Interview{" "}
            <span className="text-blue-400">Setup</span>
          </h1>

          {/* EMPTY STATE */}
          {!resumeAnalysis && (
            <div className="text-gray-400 text-sm border border-dashed border-white/20 p-4 rounded-xl">
              Upload your resume to unlock AI analysis, skills and interview questions.
            </div>
          )}

          {/* SCORE CARD */}
          {resumeAnalysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg">
                <BsStarFill />
                Resume Score: {resumeAnalysis?.score || 0}/100
              </div>

              <p className="text-gray-300 mt-2 text-sm">
                {resumeAnalysis?.insights?.summary}
              </p>
            </motion.div>
          )}

          {/* SKILLS */}
          {safeSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-lg font-semibold mb-3">Skills</h2>

              <div className="flex flex-wrap gap-2">
                {safeSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* PROJECTS */}
          {safeProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-lg font-semibold mb-3">Projects</h2>

              <div className="space-y-3">
                {safeProjects.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                      <BsCheckCircleFill />
                      {p?.title || p}
                    </div>

                    {p?.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {p.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ================= RIGHT PANEL ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 space-y-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl"
        >

          {/* ROLE INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full p-3 rounded-lg bg-[#11182E] border border-white/20 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:bg-[#1a2340] transition-all"
            />
          </div>

          {/* EXPERIENCE INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Experience
            </label>
            <input
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 2 years"
              className="w-full p-3 rounded-lg bg-[#11182E] border border-white/20 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:bg-[#1a2340] transition-all"
            />
          </div>

          {/* INTERVIEW TYPE SELECT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Interview Type
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#11182E] border border-white/20 text-white outline-none focus:border-blue-500 focus:bg-[#1a2340] transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23ffffff' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="Technical" className="bg-[#11182E] text-white">
                Technical
              </option>
              <option value="HR" className="bg-[#11182E] text-white">
                HR
              </option>
              <option value="System Design" className="bg-[#11182E] text-white">
                System Design
              </option>
              <option value="DSA" className="bg-[#11182E] text-white">
                DSA
              </option>
            </select>
          </div>

          {/* RESUME UPLOAD */}
          <label className="block border-2 border-dashed border-white/20 p-6 text-center rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition duration-200">

            {uploading ? (
              <p className="text-cyan-400 font-medium">Analyzing Resume...</p>
            ) : (
              <>
                <BsUpload className="text-3xl mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-300">
                  {resume ? resume.name : "Upload Resume (PDF)"}
                </p>

                {resume && (
                  <p className="text-green-400 text-xs mt-2 flex justify-center items-center gap-1">
                    <BsFileEarmarkPdfFill /> Uploaded Successfully
                  </p>
                )}
              </>
            )}

            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={(e) => handleResumeUpload(e.target.files[0])}
              disabled={uploading}
            />
          </label>

          {/* START BUTTON */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            disabled={starting || !role.trim() || !experience.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition duration-200 text-white"
          >
            {starting ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Starting...
              </>
            ) : (
              <>
                Start Interview
                <BsArrowRight />
              </>
            )}
          </motion.button>

          {/* INFO TEXT */}
          <p className="text-xs text-gray-500 text-center">
            This interview requires 50 credits
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Step1SetUp;