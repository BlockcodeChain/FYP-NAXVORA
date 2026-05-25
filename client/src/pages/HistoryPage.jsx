import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  motion,
} from "framer-motion";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import {
  HiMiniDocumentArrowDown,
  HiMiniCalendarDays,
  HiMiniChartBar,
  HiMiniStar,
  HiMiniExclamationTriangle,
} from "react-icons/hi2";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

import Navbar from "../components/Navbar";

import { ServerUrl } from "../App";

const HistoryPage = () => {

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  // ====================================
  // FETCH HISTORY ON MOUNT
  // ====================================
  useEffect(() => {

    const fetchHistory = async () => {

      try {
        setError("");
        setLoading(true);

        const response =
          await axios.get(
            `${ServerUrl}/api/interview/history`,
            {
              withCredentials: true,
            }
          );

        // ✅ Backend se data aata hai
        if (response?.data?.success) {
          setReports(
            response?.data?.history || []
          );
        } else {
          setReports([]);
        }

      } catch (err) {
        console.error("Fetch history error:", err);
        
        setError(
          err?.response?.data?.message ||
          "Failed to fetch interview history"
        );
        setReports([]);

      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

  }, []);

  // ====================================
  // PDF DOWNLOAD - SAVE TO BACKEND
  // ====================================
  const downloadPDF = async (
    item
  ) => {
    try {
      // ✅ Frontend mein PDF generate karo
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(0, 100, 200);
      doc.text("AI Interview Report", 20, y);

      y += 12;
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`Candidate: ${item.userName || "Candidate"}`, 20, y);
      y += 7;
      doc.text(`Role: ${item.role}`, 20, y);
      y += 7;
      doc.text(
        `Final Score: ${item.finalScore}%`,
        20,
        y
      );
      y += 7;
      doc.text(
        `Interview Mode: ${item.mode}`,
        20,
        y
      );
      y += 7;
      doc.text(
        `Date: ${new Date(item.createdAt).toLocaleString()}`,
        20,
        y
      );
      y += 12;

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);
      y += 10;

      // Questions & Answers
      const questions = item.questions || [];
      
      questions.forEach((q, i) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(0, 100, 200);
        doc.text(`Q${i + 1}  [Score: ${q.score || 0}%]`, 20, y);
        y += 7;

        doc.setTextColor(30, 30, 30);
        doc.setFontSize(10);
        const qLines = doc.splitTextToSize(
          q.question || "",
          170
        );
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

      // ✅ PDF save locally
      doc.save(
        `${item.userName || item.role}-interview-report.pdf`
      );

      // ✅ OPTIONAL: Backend mein bhi mark kar do ki downloaded hua
      try {
        await axios.post(
          `${ServerUrl}/api/interview/mark-download`,
          {
            interviewId: item._id,
          },
          {
            withCredentials: true,
          }
        );
      } catch (e) {
        console.log("Mark download error:", e);
        // isse koi issue nahi - pdf downloaded ho gaya
      }

    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to download PDF");
    }
  };

  // ====================================
  // LOADING STATE
  // ====================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="pt-32 px-4 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-lg">Loading your interview history...</p>
          </div>
        </div>
      </div>
    );
  }

  // ====================================
  // ERROR STATE
  // ====================================
  if (error) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="pt-32 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl bg-red-500/20 border border-red-500/30 p-10 text-center">
              <HiMiniExclamationTriangle className="text-5xl text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-2">Error Loading History</h2>
              <p className="text-red-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 rounded-lg font-bold hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <div className="pt-32 px-4 lg:px-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">

            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Interview History
            </h1>

            <p className="text-gray-400 mt-2">
              {reports.length} interview{reports.length !== 1 ? "s" : ""} completed
            </p>

          </div>

          {/* EMPTY STATE */}
          {reports.length === 0 ? (

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-[#11182E] border border-white/10 p-10 text-center"
            >

              <HiMiniChartBar className="text-5xl text-gray-600 mx-auto mb-4" />

              <h2 className="text-2xl font-bold">
                No Interviews Yet
              </h2>

              <p className="text-gray-400 mt-2 mb-6">
                Start your first interview to see reports here
              </p>

              <a
                href="/interview"
                className="inline-block px-6 py-3 bg-blue-600 rounded-lg font-bold hover:opacity-90 transition"
              >
                Start Interview
              </a>

            </motion.div>

          ) : (

            <div className="space-y-8">

              {reports.map(
                (item, index) => {

                  // ✅ Backend se aaye data properly calculate karo
                  const totalQuestions =
                    item.questions?.length || 0;

                  const answered =
                    item.questions?.filter(
                      (q) =>
                        q.answer && q.answer !== "No Answer"
                    ).length || 0;

                  // ✅ Scores calculate karo
                  const strengths =
                    item.questions
                      ?.filter(
                        (q) =>
                          (q.score || 0) >= 70
                      )
                      .slice(0, 2) || [];

                  const weaknesses =
                    item.questions
                      ?.filter(
                        (q) =>
                          (q.score || 0) < 50
                      )
                      .slice(0, 2) || [];

                  // ✅ Average score calculate
                  const avgScore =
                    totalQuestions > 0
                      ? Math.round(
                        (item.questions?.reduce(
                          (sum, q) => sum + (q.score || 0),
                          0
                        ) || 0) / totalQuestions
                      )
                      : 0;

                  return (

                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{ delay: index * 0.1 }}
                      id={item._id}
                      className="rounded-[30px] border border-white/10 bg-[#0B1023] p-7"
                    >

                      {/* TOP - TITLE + SCORE */}
                      <div className="flex flex-wrap justify-between gap-6 mb-8">

                        <div>

                          <h2 className="text-3xl font-black">
                            {item.role}
                          </h2>

                          <p className="text-cyan-400 mt-2 font-semibold">
                            {item.mode || "Technical"}
                          </p>

                          <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">

                            <HiMiniCalendarDays />

                            {new Date(
                              item.createdAt
                            ).toLocaleString()}

                          </div>

                        </div>

                        {/* SCORE CIRCLE */}
                        <div className="w-28 h-28 shrink-0">

                          <CircularProgressbar
                            value={
                              item.finalScore || 0
                            }
                            text={`${item.finalScore || 0}%`}
                            styles={buildStyles({
                              pathColor:
                                "#06B6D4",
                              textColor:
                                "#fff",
                              trailColor:
                                "rgba(255,255,255,0.08)",
                              textSize: "16px",
                            })}
                          />

                        </div>

                      </div>

                      {/* STATS GRID */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                        <div className="rounded-2xl bg-[#11182E] p-5 border border-white/10">

                          <h2 className="text-2xl font-black text-cyan-400">
                            {totalQuestions}
                          </h2>

                          <p className="text-gray-400 text-sm mt-1">
                            Questions
                          </p>

                        </div>

                        <div className="rounded-2xl bg-[#11182E] p-5 border border-white/10">

                          <h2 className="text-2xl font-black text-emerald-400">
                            {answered}
                          </h2>

                          <p className="text-gray-400 text-sm mt-1">
                            Answered
                          </p>

                        </div>

                        <div className="rounded-2xl bg-[#11182E] p-5 border border-white/10">

                          <h2 className="text-2xl font-black text-yellow-400">
                            {avgScore}%
                          </h2>

                          <p className="text-gray-400 text-sm mt-1">
                            Avg Score
                          </p>

                        </div>

                        <div className="rounded-2xl bg-[#11182E] p-5 border border-white/10">

                          <h2 className="text-2xl font-black text-pink-400">
                            {item.mode || "Tech"}
                          </h2>

                          <p className="text-gray-400 text-sm mt-1">
                            Type
                          </p>

                        </div>

                      </div>

                      {/* STRENGTH */}
                      <div className="mb-8">

                        <h2 className="text-xl font-black text-emerald-400 mb-4 flex items-center gap-2">
                          <HiMiniStar /> Strengths
                        </h2>

                        <div className="space-y-3">

                          {strengths.length > 0 ? (
                            strengths.map(
                              (
                                q,
                                i
                              ) => (

                                <div
                                  key={i}
                                  className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4"
                                >

                                  <p className="font-semibold text-white">
                                    {
                                      q.question
                                    }
                                  </p>

                                  <p className="text-emerald-300 mt-2 text-sm">
                                    Score: {q.score || 0}%
                                  </p>

                                </div>
                              )
                            )
                          ) : (
                            <p className="text-gray-400 italic">
                              No major strengths identified
                            </p>
                          )}

                        </div>

                      </div>

                      {/* WEAKNESS */}
                      <div className="mb-8">

                        <h2 className="text-xl font-black text-red-400 mb-4 flex items-center gap-2">
                          <HiMiniExclamationTriangle /> Weaknesses
                        </h2>

                        <div className="space-y-3">

                          {weaknesses.length > 0 ? (
                            weaknesses.map(
                              (
                                q,
                                i
                              ) => (

                                <div
                                  key={i}
                                  className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4"
                                >

                                  <p className="font-semibold text-white">
                                    {
                                      q.question
                                    }
                                  </p>

                                  <p className="text-red-300 mt-2 text-sm">
                                    Score: {q.score || 0}%
                                  </p>

                                </div>
                              )
                            )
                          ) : (
                            <p className="text-gray-400 italic">
                              No significant weaknesses found
                            </p>
                          )}

                        </div>

                      </div>

                      {/* QUESTIONS */}
                      <div className="mb-8">

                        <h2 className="text-2xl font-black mb-5">
                          Full Interview Report
                        </h2>

                        <div className="space-y-5">

                          {(item.questions || []).map(
                            (
                              q,
                              i
                            ) => (

                              <div
                                key={i}
                                className="rounded-2xl bg-[#11182E] border border-white/10 p-5"
                              >

                                <h2 className="font-bold text-cyan-400">
                                  Q{i + 1}.
                                  {" "}
                                  {
                                    q.question
                                  }
                                </h2>

                                <p className="mt-4 text-gray-300 text-sm">
                                  <span className="font-bold text-white">
                                    Answer:
                                  </span>
                                  {" "}
                                  {
                                    q.answer || "No answer provided"
                                  }
                                </p>

                                {q.feedback && (
                                  <p className="mt-4 text-gray-300 text-sm">
                                    <span className="font-bold text-emerald-400">
                                      Feedback:
                                    </span>
                                    {" "}
                                    {q.feedback}
                                  </p>
                                )}

                                <div className="mt-4">

                                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

                                    <div
                                      style={{
                                        width: `${q.score || 0}%`,
                                      }}
                                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                    />

                                  </div>

                                  <p className="mt-2 text-sm text-gray-400">
                                    Score:
                                    {" "}
                                    {
                                      q.score || 0
                                    }
                                    /100
                                  </p>

                                </div>

                              </div>
                            )
                          )}

                        </div>

                      </div>

                      {/* DOWNLOAD BUTTON */}
                      <div className="flex justify-end">

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            downloadPDF(item)
                          }
                          className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:opacity-90 transition"
                        >

                          <HiMiniDocumentArrowDown className="text-xl" />

                          Download PDF

                        </motion.button>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default HistoryPage;