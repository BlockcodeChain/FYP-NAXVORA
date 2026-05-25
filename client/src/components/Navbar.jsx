import { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaRobot,
  FaCoins,
  FaHistory,
  FaRocket,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";

import {
  setShowCredentialPopup,
  setUserData,
} from "../redux/userSlice";

import axios from "axios";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import toast from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const popupRef = useRef(null);

  const { userData } = useSelector(
    (state) => state.user
  );

  const [showUserPopup, setShowUserPopup] =
    useState(false);

  // =========================================
  // CLOSE POPUP
  // =========================================
  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        popupRef.current &&
        !popupRef.current.contains(
          event.target
        )
      ) {
        setShowUserPopup(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);

  // =========================================
  // NAVIGATION
  // =========================================
  const handleNavigate = (path) => {

    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  // =========================================
  // LOGOUT
  // =========================================
  const handleLogout = async () => {

    try {

      await axios.post(
        `${SERVER_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(null));

      toast.success(
        "Logged out successfully 👋"
      );

      navigate("/auth");

    } catch (error) {

      console.log(error);

      toast.error("Logout Failed");

    }

  };

  // =========================================
  // NAV LINKS
  // =========================================
  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Interview",
      path: "/interview",
    },
    {
      name: "History",
      path: "/history",
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-[999] px-4 pt-5">

      {/* BLUR BACKGROUND */}
      <div className="absolute top-[-120px] left-[5%] w-[250px] h-[250px] bg-emerald-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute top-[-120px] right-[5%] w-[250px] h-[250px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      {/* MAIN NAVBAR */}
      <motion.div
        initial={{
          opacity: 0,
          y: -40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="max-w-7xl mx-auto"
      >

        <div className="relative overflow-visible rounded-[32px] border border-white/10 bg-[#0b1120]/75 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.45)] px-6 py-4">

          {/* GLOW */}
          <div className="absolute top-[-100px] right-[-100px] w-[220px] h-[220px] bg-emerald-500/10 blur-[100px] rounded-full"></div>

          <div className="absolute bottom-[-100px] left-[-100px] w-[220px] h-[220px] bg-cyan-500/10 blur-[100px] rounded-full"></div>

          {/* NAV CONTENT */}
          <div className="relative z-10 flex items-center justify-between">

            {/* ========================================= */}
            {/* LOGO */}
            {/* ========================================= */}
            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              onClick={() =>
                handleNavigate("/")
              }
              className="flex items-center gap-4 cursor-pointer"
            >

              {/* ICON */}
              <div className="relative">

                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-40"></div>

                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">

                  <FaRobot className="text-white text-3xl" />

                </div>

              </div>

              {/* TEXT */}
              <div>

                <h1 className="text-2xl font-black tracking-wide text-white">

                  NEXVORA
                  <span className="text-emerald-400">
                    .AI
                  </span>

                </h1>

                <p className="text-[10px] uppercase tracking-[5px] text-gray-400 mt-1">

                  AI INTERVIEW SYSTEM

                </p>

              </div>

            </motion.div>

            {/* ========================================= */}
            {/* NAV CENTER */}
            {/* ========================================= */}
            <div className="hidden lg:flex items-center gap-3 bg-white/[0.04] border border-white/5 px-3 py-2 rounded-2xl backdrop-blur-xl">

              {navLinks.map((item, index) => (

                <motion.button
                  key={index}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    handleNavigate(
                      item.path
                    )
                  }
                  className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    location.pathname ===
                    item.path
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >

                  {/* ACTIVE */}
                  {location.pathname ===
                    item.path && (

                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      style={{
                        zIndex: -1,
                      }}
                    />

                  )}

                  {item.name}

                </motion.button>

              ))}

            </div>

            {/* ========================================= */}
            {/* RIGHT SIDE */}
            {/* ========================================= */}
            <div className="flex items-center gap-4">

              {/* CREDITS */}
              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() =>
                  dispatch(
                    setShowCredentialPopup(
                      true
                    )
                  )
                }
                className="hidden sm:flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.06] transition-all"
              >

                {/* ICON */}
                <div className="relative">

                  <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-40"></div>

                  <div className="relative w-11 h-11 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">

                    <FaCoins className="text-white text-lg" />

                  </div>

                </div>

                {/* TEXT */}
                <div className="text-left">

                  <p className="text-[11px] uppercase tracking-wider text-gray-400">

                    Credits

                  </p>

                  <h2 className="text-lg font-black text-white">

                    {userData?.credits ?? 0}

                  </h2>

                </div>

              </motion.button>

              {/* LOGIN */}
              {!userData ? (

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={() =>
                    handleNavigate(
                      "/auth"
                    )
                  }
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-[0_0_35px_rgba(16,185,129,0.25)]"
                >

                  Login

                </motion.button>

              ) : (

                <div
                  className="relative"
                  ref={popupRef}
                >

                  {/* USER BUTTON */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={() =>
                      setShowUserPopup(
                        !showUserPopup
                      )
                    }
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl hover:bg-white/[0.06] transition-all"
                  >

                    {/* AVATAR */}
                    <div className="relative">

                      <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50"></div>

                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg">

                        {userData?.name?.charAt(
                          0
                        )}

                      </div>

                    </div>

                    {/* INFO */}
                    <div className="hidden md:block text-left">

                      <h3 className="font-bold text-white leading-none">

                        {
                          userData?.name?.split(
                            " "
                          )[0]
                        }

                      </h3>

                      <p className="text-xs text-gray-400 mt-1">

                        {userData?.email}

                      </p>

                    </div>

                  </motion.button>

                  {/* ========================================= */}
                  {/* POPUP */}
                  {/* ========================================= */}
                  <AnimatePresence>

                    {showUserPopup && (

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 20,
                          scale: 0.96,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: 20,
                          scale: 0.96,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="absolute right-0 top-20 w-[340px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a]/95 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
                      >

                        {/* GLOW */}
                        <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] bg-emerald-500/20 blur-[120px] rounded-full"></div>

                        <div className="absolute bottom-[-80px] left-[-80px] w-[220px] h-[220px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

                        {/* CONTENT */}
                        <div className="relative z-10 p-6">

                          {/* PROFILE */}
                          <div className="flex items-center gap-4">

                            {/* BIG AVATAR */}
                            <div className="relative">

                              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-50"></div>

                              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-black">

                                {userData?.name?.charAt(
                                  0
                                )}

                              </div>

                            </div>

                            {/* INFO */}
                            <div>

                              <h2 className="text-xl font-black text-white capitalize">

                                {userData?.name}

                              </h2>

                              <p className="text-sm text-gray-400 mt-1 break-all">

                                {userData?.email}

                              </p>

                            </div>

                          </div>

                          {/* PREMIUM */}
                          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl p-4">

                            <div className="flex items-center gap-4">

                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]">

                                <FaRocket className="text-white text-lg" />

                              </div>

                              <div>

                                <h3 className="font-bold text-white">

                                  Premium Access

                                </h3>

                                <p className="text-sm text-gray-300">

                                  AI Interview Suite Enabled

                                </p>

                              </div>

                            </div>

                          </div>

                          {/* MENU */}
                          <div className="mt-5 space-y-3">

                            {/* HISTORY */}
                            <motion.button
                              whileHover={{
                                x: 4,
                              }}
                              onClick={() => {

                                navigate(
                                  "/history"
                                );

                                setShowUserPopup(
                                  false
                                );

                              }}
                              className="w-full flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] p-4 transition-all"
                            >

                              <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">

                                <FaHistory className="text-blue-400 text-lg" />

                              </div>

                              <div className="text-left">

                                <h3 className="font-bold text-white">

                                  Interview History

                                </h3>

                                <p className="text-sm text-gray-400">

                                  Previous AI Sessions

                                </p>

                              </div>

                            </motion.button>

                            {/* PROFILE */}
                            <motion.button
                              whileHover={{
                                x: 4,
                              }}
                              className="w-full flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] p-4 transition-all"
                            >

                              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">

                                <FaUserCircle className="text-purple-400 text-lg" />

                              </div>

                              <div className="text-left">

                                <h3 className="font-bold text-white">

                                  My Profile

                                </h3>

                                <p className="text-sm text-gray-400">

                                  Account Information

                                </p>

                              </div>

                            </motion.button>

                            {/* LOGOUT */}
                            <motion.button
                              whileHover={{
                                x: 4,
                              }}
                              onClick={
                                handleLogout
                              }
                              className="w-full flex items-center gap-4 rounded-2xl border border-red-500/10 bg-red-500/[0.05] hover:bg-red-500/[0.08] p-4 transition-all"
                            >

                              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">

                                <FaSignOutAlt className="text-red-400 text-lg" />

                              </div>

                              <div className="text-left">

                                <h3 className="font-bold text-red-400">

                                  Logout

                                </h3>

                                <p className="text-sm text-red-300/70">

                                  Sign out from account

                                </p>

                              </div>

                            </motion.button>

                          </div>

                        </div>

                      </motion.div>

                    )}

                  </AnimatePresence>

                </div>

              )}

            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default Navbar;