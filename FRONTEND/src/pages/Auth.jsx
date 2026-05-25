import { useState } from "react";
import { motion } from "framer-motion";

import {
  RiRobot2Fill,
  RiShieldCheckLine,
} from "react-icons/ri";

import {
  HiSparkles,
  HiMiniCpuChip,
  HiMiniChartBar,
} from "react-icons/hi2";

import { FcGoogle } from "react-icons/fc";

import { auth, provider } from "../utils/Firebase";
import { signInWithPopup } from "firebase/auth";

import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { ServerUrl } from "../App";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // GOOGLE AUTH
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      if (!user?.email) {
        toast.error("Google authentication failed");
        return;
      }

      // BACKEND API
      const res = await axios.post(
        `${ServerUrl}/api/auth/googleAuth`,
        {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL || "",
        },
        { withCredentials: true }
      );

      if (res.data?.user) {
        dispatch(setUserData(res.data.user));

        toast.success("Login successful 🎉");

        navigate("/");
      } else {
        toast.error("Login failed");
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
        "Authentication failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex items-center justify-center px-5">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-180px] right-[-150px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full"></div>

      {/* GRID EFFECT */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* MAIN CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
        }}
        className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)]"
      >
        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-white/10 overflow-hidden">
          {/* Blur */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 blur-[100px] rounded-full"></div>

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                <RiRobot2Fill className="text-white text-3xl" />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white tracking-wide">
                  NEXVORA
                  <span className="text-cyan-400">.AI</span>
                </h1>

                <p className="text-gray-400 text-sm mt-1">
                  Smart AI Interview Platform
                </p>
              </div>
            </div>

            {/* TEXT */}
            <div className="mt-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm">
                <HiSparkles />
                AI Powered Placement Preparation
              </div>

              <h2 className="text-5xl font-black leading-tight text-white mt-8">
                Prepare For
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                  Future Careers
                </span>
              </h2>

              <p className="text-gray-400 leading-relaxed mt-8 text-lg">
                Practice realistic mock interviews, improve communication,
                analyze resumes, and receive intelligent AI feedback to crack
                your dream placements faster.
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="relative z-10 grid grid-cols-1 gap-5 mt-10">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <HiMiniCpuChip className="text-white text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  AI Mock Interviews
                </h3>

                <p className="text-gray-400 text-sm">
                  HR + Technical Interview Simulations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <HiMiniChartBar className="text-white text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Smart AI Analytics
                </h3>

                <p className="text-gray-400 text-sm">
                  Confidence & Communication Tracking
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 sm:p-12 flex flex-col justify-center relative">
          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <RiRobot2Fill className="text-white text-2xl" />
            </div>

            <h1 className="text-2xl font-black text-white">
              NEXVORA
              <span className="text-cyan-400">.AI</span>
            </h1>
          </div>

          {/* TOP BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm w-fit">
            <RiShieldCheckLine />
            Secure Google Authentication
          </div>

          {/* HEADING */}
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mt-8">
            Welcome Back
          </h2>

          {/* SUBTITLE */}
          <p className="text-gray-400 leading-relaxed mt-6 text-lg">
            Continue your AI powered interview journey and access your personal
            dashboard, analytics, mock interviews and performance reports.
          </p>

          {/* FEATURES MINI */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-3xl font-black text-cyan-400">10K+</h3>

              <p className="text-gray-400 text-sm mt-2">
                AI Interviews Completed
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-3xl font-black text-blue-400">95%</h3>

              <p className="text-gray-400 text-sm mt-2">
                Placement Success Rate
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`mt-10 w-full flex items-center justify-center gap-4 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
              loading
                ? "opacity-60 cursor-not-allowed bg-white/10"
                : "bg-white hover:bg-gray-100 shadow-2xl"
            }`}
          >
            <FcGoogle size={30} />

            {loading
              ? "Authenticating..."
              : "Continue With Google"}
          </motion.button>

          {/* FOOTER */}
          <p className="text-gray-500 text-sm text-center mt-8 leading-relaxed">
            By continuing, you agree to our
            <span className="text-white font-medium">
              {" "}Terms of Service{" "}
            </span>
            and
            <span className="text-white font-medium">
              {" "}Privacy Policy
            </span>
          </p>

          {/* CREDIT */}
          <div className="flex items-center justify-center mt-8">
            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
              Crafted with ❤️ by
              <span className="text-white font-semibold">
                {" "}Aanshi Sahu
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;