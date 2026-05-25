import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import jsPDF from "jspdf";

import {
  HiMiniCheckBadge,
  HiMiniChartBar,
  HiMiniArrowDownTray,
  HiMiniTrophy,
  HiMiniCpuChip,
  HiMiniArrowPath,
  HiMiniBolt,
  HiMiniStar,
  HiMiniExclamationTriangle,
  HiMiniCheckCircle,
} from "react-icons/hi2";

import { RiRobot2Fill } from "react-icons/ri";

const Step3Report = ({ reportData, onRestart }) => {
  // ================= VALIDATION =================
  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No report data available</p>
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-2xl bg-cyan-500 font-bold hover:opacity-90"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const {
    userName = "Candidate",
    role = "Developer",
    finalScore = 0,
    answered = 0,
    total = 0,
    reportAnswers = [],
  } = reportData;

  // ================= ANALYTICS =================
  const analytics = useMemo(() => {
    if (!reportAnswers.length) {
      return {
        strongest: "N/A",
        weakest: "N/A",
        avgScore: 0,
        passed: 0,
      };
    }

    const sorted = [...reportAnswers].sort((a, b) => b.score - a.score);
    const avgScore = Math.round(
      reportAnswers.reduce((sum, q) => sum + (q.score || 0), 0) /
        reportAnswers.length
    );
    const passed = reportAnswers.filter((q) => q.score >= 60).length;

    return {
      strongest: sorted[0]?.type || "N/A",
      weakest: sorted[sorted.length - 1]?.type || "N/A",
      avgScore,
      passed,
    };
  }, [reportAnswers]);

  // ================= SCORE LABEL + COLOR =================
  const scoreConfig = useMemo(() => {
    if (finalScore >= 80)
      return {
        label: "Excellent",
        color: "#10b981",
        bg: "from-emerald-500/20 to-teal-500/10",
        border: "border-emerald-500/30",
      };
    if (finalScore >= 60)
      return {
        label: "Good",
        color: "#00E5FF",
        bg: "from-cyan-500/20 to-blue-500/10",
        border: "border-cyan-500/30",
      };
    return {
      label: "Needs Improvement",
      color: "#f59e0b",
      bg: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/30",
    };
  }, [finalScore]);

  // ================= PDF DOWNLOAD =================
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 100, 200);
    doc.text("AI Interview Report", 20, y);

    y += 12;
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Candidate: ${userName}`, 20, y);
    y += 7;
    doc.text(`Role: ${role}`, 20, y);
    y += 7;
    doc.text(
      `Final Score: ${finalScore}%  (${scoreConfig.label})`,
      20,
      y
    );
    y += 7;
    doc.text(`Questions Answered: ${answered}/${total}`, 20, y);
    y += 7;
    doc.text(`Average Score: ${analytics.avgScore}%`, 20, y);
    y += 12;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 10;

    // Questions
    reportAnswers.forEach((q, i) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(0, 100, 200);
      doc.text(`Q${i + 1}  [Score: ${q.score}%]`, 20, y);
      y += 7;

      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      const qLines = doc.splitTextToSize(q.question || "", 170);
      doc.text(qLines, 20, y);
      y += qLines.length * 6 + 3;

      doc.setTextColor(60, 60, 60);
      const aLines = doc.splitTextToSize(
        `Answer: ${q.answer || "No Answer"}`,
        170
      );
      doc.text(aLines, 20, y);
      y += aLines.length * 6 + 3;

      doc.setTextColor(0, 140, 120);
      const fLines = doc.splitTextToSize(
        `Feedback: ${q.feedback || ""}`,
        170
      );
      doc.text(fLines, 20, y);
      y += fLines.length * 6 + 8;

      doc.setDrawColor(230, 230, 230);
      doc.line(20, y, 190, y);
      y += 8;
    });

    doc.save(`${userName}-interview-report.pdf`);
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-8 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ===== HEADER CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[30px] bg-[#0B1023] border border-white/10 p-7 lg:p-9"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-8">

            {/* LEFT - Info */}
            <div className="flex-1">

              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                  <RiRobot2Fill className="text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Interview Complete
                  </h1>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {userName} &nbsp;•&nbsp; {role}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">

                <div className="rounded-2xl bg-[#11182E] border border-white/8 p-4">
                  <p className="text-gray-400 text-xs mb-1">Answered</p>
                  <p className="text-xl font-black text-white">
                    {answered}
                    <span className="text-gray-500 text-base font-normal">
                      /{total}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-[#11182E] border border-white/8 p-4">
                  <p className="text-gray-400 text-xs mb-1">Avg Score</p>
                  <p className="text-xl font-black text-cyan-400">
                    {analytics.avgScore}%
                  </p>
                </div>

                <div className="rounded-2xl bg-[#11182E] border border-white/8 p-4">
                  <p className="text-gray-400 text-xs mb-1">Passed</p>
                  <p className="text-xl font-black text-emerald-400">
                    {analytics.passed}
                    <span className="text-gray-500 text-base font-normal">
                      /{total}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-[#11182E] border border-white/8 p-4">
                  <p className="text-gray-400 text-xs mb-1">Result</p>
                  <p
                    className="text-base font-black truncate"
                    style={{ color: scoreConfig.color }}
                  >
                    {scoreConfig.label}
                  </p>
                </div>

              </div>

              {/* Strongest / Weakest */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-2xl bg-[#11182E] border border-white/8 p-4 flex items-center gap-3">
                  <HiMiniStar className="text-yellow-400 text-xl shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Strongest</p>
                    <p className="text-sm font-bold text-white truncate">
                      {analytics.strongest}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#11182E] border border-white/8 p-4 flex items-center gap-3">
                  <HiMiniExclamationTriangle className="text-red-400 text-xl shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Weakest</p>
                    <p className="text-sm font-bold text-white truncate">
                      {analytics.weakest}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT - Score circle */}
            <div className="flex flex-col items-center justify-center gap-4 shrink-0">
              <div className="w-[160px] h-[160px]">
                <CircularProgressbar
                  value={finalScore}
                  text={`${finalScore}%`}
                  styles={buildStyles({
                    pathColor: scoreConfig.color,
                    textColor: "#fff",
                    trailColor: "rgba(255,255,255,0.06)",
                    textSize: "18px",
                  })}
                />
              </div>
              <div
                className={`px-5 py-2 rounded-full border text-sm font-bold bg-gradient-to-r ${scoreConfig.bg} ${scoreConfig.border}`}
                style={{ color: scoreConfig.color }}
              >
                {scoreConfig.label}
              </div>
            </div>

          </div>
        </motion.div>

        {/* ===== Q&A LIST ===== */}
        {reportAnswers.length > 0 ? (
          <div className="space-y-4">
            {reportAnswers.map((q, i) => {
              const qScore = q.score || 0;
              const isPassed = qScore >= 60;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="rounded-[24px] bg-[#0B1023] border border-white/10 overflow-hidden"
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#0d1327]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <HiMiniCpuChip className="text-cyan-400 text-lg" />
                      </div>
                      <div>
                        <span className="text-cyan-400 font-black text-sm">
                          Question {i + 1}
                        </span>
                        {q.type && (
                          <span className="ml-2 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {q.type}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPassed ? (
                        <HiMiniCheckCircle className="text-emerald-400 text-lg" />
                      ) : (
                        <HiMiniExclamationTriangle className="text-amber-400 text-lg" />
                      )}
                      <span
                        className="text-lg font-black"
                        style={{
                          color: isPassed ? "#10b981" : "#f59e0b",
                        }}
                      >
                        {qScore}%
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5 space-y-4">

                    {/* Question text */}
                    <p className="text-gray-100 font-semibold leading-relaxed">
                      {q.question || "—"}
                    </p>

                    {/* Answer */}
                    <div className="rounded-2xl bg-[#11182E] border border-white/8 p-4">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
                        Your Answer
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {q.answer && q.answer !== "No Answer" ? (
                          q.answer
                        ) : (
                          <span className="text-gray-600 italic">
                            No answer provided
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Feedback */}
                    {q.feedback && (
                      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/8 to-cyan-500/8 border border-emerald-500/20 p-4">
                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">
                          AI Feedback
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {q.feedback}
                        </p>
                      </div>
                    )}

                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Agar reportAnswers empty hai
          <div className="rounded-[24px] bg-[#0B1023] border border-white/10 p-10 text-center">
            <HiMiniChartBar className="text-4xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No detailed answers available.</p>
          </div>
        )}

        {/* ===== ACTION BUTTONS ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center pb-8"
        >
          <button
            onClick={downloadPDF}
            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-black text-base hover:opacity-90 transition-opacity"
          >
            <HiMiniArrowDownTray className="text-xl" />
            Download PDF Report
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-3 px-7 py-4 rounded-2xl border border-white/10 bg-[#11182E] hover:bg-[#1a2340] transition-all font-bold text-base"
          >
            <HiMiniArrowPath className="text-xl" />
            New Interview
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Step3Report;