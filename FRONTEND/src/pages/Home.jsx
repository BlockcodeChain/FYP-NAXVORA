import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  BsRobot,
  BsMic,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
  BsStars,
} from "react-icons/bs";

import {
  HiSparkles,
  HiMiniChartBar,
  HiMiniCpuChip,
} from "react-icons/hi2";

import confidenceimg from "../assets/confi.png";
import hrimg from "../assets/HR.png";
import techimg from "../assets/tech.png";
import evalimg from "../assets/ai-ans.png";
import resumeimg from "../assets/resume.png";
import pdfimg from "../assets/pdf.png";

const Home = () => {
  const { userData } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/auth");
    }
  }, [userData, navigate]);

  const features = [
    {
      image: hrimg,
      title: "AI HR Interviews",
      desc: "Realistic HR interview simulations with AI generated questions and smart responses.",
      icon: <BsRobot />,
    },
    {
      image: techimg,
      title: "Technical Mock Rounds",
      desc: "Frontend, backend, DSA and system design interviews with AI evaluation.",
      icon: <HiMiniCpuChip />,
    },
    {
      image: evalimg,
      title: "Smart AI Feedback",
      desc: "Get instant communication, confidence and technical performance reports.",
      icon: <BsBarChart />,
    },
    {
      image: resumeimg,
      title: "Resume Analyzer",
      desc: "Upload resume and receive ATS based AI suggestions instantly.",
      icon: <BsFileEarmarkText />,
    },
    {
      image: pdfimg,
      title: "Professional Reports",
      desc: "Download detailed interview reports in clean professional PDF format.",
      icon: <HiMiniChartBar />,
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "AI Interviews",
    },
    {
      number: "95%",
      label: "Success Rate",
    },
    {
      number: "24/7",
      label: "AI Availability",
    },
    {
      number: "100+",
      label: "Interview Roles",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden text-white relative">
      {/* BACKGROUND */}
      <div className="absolute top-[-120px] left-[-120px] w-[380px] h-[380px] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-120px] w-[380px] h-[380px] bg-indigo-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full"></div>

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* HERO */}
      <section className="relative pt-32 pb-14 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-full">
              <HiSparkles className="text-cyan-400 text-xl" />

              <span className="text-sm text-gray-300">
                AI Powered Smart Interview Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05]">
              Crack Your
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                Dream Interview
              </span>
              With Nexvora AI
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              Practice realistic AI powered mock interviews with voice
              interaction, resume analysis, confidence tracking, technical
              evaluation and smart performance analytics.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5">
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => navigate("/interview")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 rounded-2xl font-bold shadow-[0_0_40px_rgba(59,130,246,0.4)] flex items-center gap-3"
              >
                Start Interview
                <BsArrowRight />
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => navigate("/history")}
                className="bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all"
              >
                View History
              </motion.button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
              {stats.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5"
                >
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {item.number}
                  </h2>

                  <p className="text-sm text-gray-400 mt-2">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative"
          >
            {/* MAIN IMAGE CARD */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.8rem] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] max-w-[540px] mx-auto overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-[-80px] right-[-60px] w-[220px] h-[220px] bg-cyan-500/20 blur-[90px] rounded-full"></div>

              <div className="absolute bottom-[-100px] left-[-60px] w-[220px] h-[220px] bg-blue-600/20 blur-[90px] rounded-full"></div>

              <img
                src={confidenceimg}
                alt="AI Interview"
                className="w-full max-w-[460px] mx-auto object-contain drop-shadow-[0_20px_40px_rgba(59,130,246,0.25)]"
              />
            </motion.div>

            {/* FLOAT CARD 1 */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute top-10 -left-4 hidden md:flex bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl px-5 py-4 items-center gap-4 shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                <BsMic />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Voice Interview
                </h3>

                <p className="text-gray-400 text-sm">
                  Real-Time AI Interaction
                </p>
              </div>
            </motion.div>

            {/* FLOAT CARD 2 */}
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute bottom-5 right-0 hidden md:flex bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl px-5 py-4 items-center gap-4 shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                <BsStars />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  AI Evaluation
                </h3>

                <p className="text-gray-400 text-sm">
                  Smart Confidence Tracking
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED */}
      <section className="py-6 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 uppercase tracking-[5px] text-sm mb-8">
            Trusted By Future Developers
          </p>

          <div className="flex flex-wrap justify-center gap-10 text-3xl font-black text-white/30">
            <span>Google</span>
            <span>Microsoft</span>
            <span>Amazon</span>
            <span>Meta</span>
            <span>Netflix</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-cyan-400 font-semibold mb-4">
              Powerful Features
            </p>

            <h2 className="text-5xl font-black leading-tight">
              Everything You Need To
              <span className="block mt-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Crack Interviews
              </span>
            </h2>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -10,
                }}
                className="relative bg-gradient-to-b from-white/10 to-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.35)] group hover:border-cyan-400/30 transition-all duration-500"
              >
                {/* IMAGE */}
                <div className="overflow-hidden h-44 bg-black/20">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 brightness-90"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mb-6">
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="py-14 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10 rounded-[3rem] p-8 lg:p-14 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            {/* Glow */}
            <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] bg-cyan-500/10 blur-[100px] rounded-full"></div>

            <div className="grid lg:grid-cols-2 gap-14 items-center">
              {/* LEFT */}
              <div>
                <p className="text-cyan-400 font-semibold mb-4">
                  AI Analytics Dashboard
                </p>

                <h2 className="text-5xl font-black leading-tight">
                  Track Your Growth Like A Professional
                </h2>

                <p className="text-gray-400 leading-relaxed mt-6 text-lg">
                  Get detailed AI reports including communication analysis,
                  confidence score, technical evaluation and overall interview
                  performance tracking.
                </p>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 px-7 py-4 rounded-2xl font-bold"
                >
                  Open Dashboard
                </button>
              </div>

              {/* RIGHT */}
              <div className="bg-[#0b1120] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                <div className="space-y-7">
                  {[
                    {
                      title: "Communication",
                      value: "92%",
                      width: "92%",
                      color: "bg-blue-500",
                    },
                    {
                      title: "Technical Skills",
                      value: "84%",
                      width: "84%",
                      color: "bg-cyan-500",
                    },
                    {
                      title: "Confidence",
                      value: "88%",
                      width: "88%",
                      color: "bg-indigo-500",
                    },
                    {
                      title: "Problem Solving",
                      value: "78%",
                      width: "78%",
                      color: "bg-purple-500",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span>{item.title}</span>
                        <span>{item.value}</span>
                      </div>

                      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: item.width,
                          }}
                          className={`h-full ${item.color} rounded-full`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-14 text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <h2 className="text-5xl font-black leading-tight">
              Ready To Ace Your Next Interview?
            </h2>

            <p className="text-blue-100 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
              Start AI powered mock interviews today and improve your
              communication, confidence and technical skills faster than ever.
            </p>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => navigate("/interview")}
              className="mt-10 bg-white text-blue-700 px-10 py-4 rounded-2xl font-black shadow-2xl"
            >
              Start Interview Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/10 bg-[#020617] px-6 lg:px-20 pt-10 pb-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-[-120px] left-[10%] w-[260px] h-[260px] bg-blue-500/10 blur-[120px] rounded-full"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* TOP */}
          <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <BsRobot className="text-white text-2xl" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Nexvora
                    <span className="text-cyan-400"> AI</span>
                  </h2>

                  <p className="text-xs text-gray-500 tracking-wide">
                    AI INTERVIEW ECOSYSTEM
                  </p>
                </div>
              </div>

              <p className="text-gray-400 mt-5 leading-relaxed max-w-sm">
                Smart AI powered interview preparation platform helping
                students and developers crack top tech interviews confidently.
              </p>
            </div>

            {/* LINKS */}
            <div>
              <h3 className="text-lg font-bold mb-5">
                Platform
              </h3>

              <div className="space-y-4 text-gray-400">
                <button className="block hover:text-white transition-all">
                  Mock Interviews
                </button>

                <button className="block hover:text-white transition-all">
                  AI Dashboard
                </button>

                <button className="block hover:text-white transition-all">
                  Resume Analyzer
                </button>

                <button className="block hover:text-white transition-all">
                  Performance Reports
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <h3 className="text-lg font-bold mb-5">
                Built For Developers
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Designed with modern AI workflows, real-time analytics and
                realistic interview simulations for placement preparation.
              </p>

              <div className="mt-6 flex gap-3">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                  AI Powered
                </div>

                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                  Real-Time
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
            <p className="text-gray-500 text-sm">
              © 2026 Nexvora AI. All rights reserved.
            </p>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>

              <p className="text-sm text-gray-300">
                Crafted by{" "}
                <span className="text-white font-semibold">
                  Aanshi Sahu
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;