import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import {
  HiMiniMicrophone,
  HiMiniStop,
  HiMiniSpeakerWave,
  HiMiniCpuChip,
  HiMiniChartBar,
  HiMiniBolt,
  HiMiniCheckBadge,
} from "react-icons/hi2";

import { RiRobot2Fill } from "react-icons/ri";

import malevideo from "../assets/male-ai.mp4";

import { ServerUrl } from "../App";

const Step2Interview = ({
  interviewData,
  onFinish,
}) => {
  // =========================================
  // DATA
  // =========================================
  const {
    interviewId,
    questions = [],
    userName = "Candidate",
  } = interviewData || {};

  // =========================================
  // STATES
  // =========================================
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const [timeLeft, setTimeLeft] =
    useState(120);

  const [loading, setLoading] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [isAISpeaking, setIsAISpeaking] =
    useState(false);

  const [currentFeedback, setCurrentFeedback] =
    useState("");

  const [currentScore, setCurrentScore] =
    useState(0);

  const [confidenceLevel, setConfidenceLevel] =
    useState(0);

  const [error, setError] = useState("");

  const [aiStatus, setAiStatus] =
    useState("Waiting");

  const [feedbackSpeaking, setFeedbackSpeaking] =
    useState(false);

  const recognitionRef = useRef(null);

  const synthRef = useRef(
    window.speechSynthesis
  );

  // stale closure fix - timer ke andar answer milti rahe
  const answerRef = useRef("");

  // timer ke andar loading check ke liye
  const loadingRef = useRef(false);

  // double submit rokne ke liye
  const submitCalledRef = useRef(false);

  // report ke liye saare Q&A collect karo locally
  // (agar server reportAnswers nahi bheje toh fallback)
  const allAnswersRef = useRef([]);

  const currentQ =
    questions?.[currentQuestion];

  // =========================================
  // PROGRESS
  // =========================================
  const progress = useMemo(() => {
    if (!questions?.length) return 0;

    return (
      ((currentQuestion + 1) /
        questions.length) *
      100
    );
  }, [currentQuestion, questions]);

  // =========================================
  // LOAD VOICES
  // =========================================
  useEffect(() => {
    speechSynthesis.getVoices();

    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  // =========================================
  // ANSWER REF SYNC
  // =========================================
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  // =========================================
  // LOADING REF SYNC
  // =========================================
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // =========================================
  // TIMER
  // =========================================
  useEffect(() => {
    if (!currentQ) return;

    submitCalledRef.current = false;

    setTimeLeft(
      currentQ?.timeLimit || 120
    );

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (!loadingRef.current && !submitCalledRef.current) {
            submitCalledRef.current = true;
            handleSubmitAnswer(true);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  // =========================================
  // GET BEST MALE VOICE
  // =========================================
  const getMaleVoice = () => {
    const voices =
      speechSynthesis.getVoices();

    return (
      voices.find((v) =>
        v.name
          .toLowerCase()
          .includes("google uk english male")
      ) ||
      voices.find((v) =>
        v.name
          .toLowerCase()
          .includes("david")
      ) ||
      voices.find((v) =>
        v.name
          .toLowerCase()
          .includes("mark")
      ) ||
      voices.find((v) =>
        v.name
          .toLowerCase()
          .includes("male")
      ) ||
      voices[0]
    );
  };

  // =========================================
  // SPEAK TEXT
  // =========================================
  const speakText = (
    text,
    callback = null
  ) => {
    if (!text) return;

    try {
      synthRef.current.cancel();

      const speech =
        new SpeechSynthesisUtterance(
          text
        );

      speech.voice = getMaleVoice();

      speech.rate = 0.86;

      speech.pitch = 0.92;

      speech.volume = 1;

      setIsAISpeaking(true);

      setAiStatus("AI Speaking");

      speech.onend = () => {
        setIsAISpeaking(false);

        setAiStatus("Waiting");

        if (callback) callback();
      };

      speech.onerror = () => {
        setIsAISpeaking(false);

        setAiStatus("Voice Error");

        if (callback) callback();
      };

      synthRef.current.speak(speech);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================
  // AUTO SPEAK QUESTION
  // =========================================
  useEffect(() => {
    if (currentQ?.question) {
      const timer = setTimeout(() => {
        speakText(currentQ.question);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentQuestion]);

  // =========================================
  // START LISTENING
  // =========================================
  const startListening = async () => {
    try {
      setError("");

      if (
        window.location.protocol !==
          "https:" &&
        window.location.hostname !==
          "localhost"
      ) {
        setError(
          "Microphone works only on HTTPS or localhost"
        );
        return;
      }

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError(
          "Use latest Google Chrome browser"
        );
        return;
      }

      await navigator.mediaDevices.getUserMedia(
        {
          audio: true,
        }
      );

      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }

      const recognition =
        new SpeechRecognition();

      recognition.continuous = true;

      recognition.interimResults = true;

      recognition.lang = "en-US";

      recognition.maxAlternatives = 1;

      recognitionRef.current =
        recognition;

      recognition.onstart = () => {
        setIsListening(true);

        setAiStatus("Listening...");
      };

      recognition.onend = () => {
        if (recognitionRef.current === recognition) {
          setIsListening(false);
          setAiStatus("Waiting");
        }
      };

      recognition.onerror = (event) => {
        console.log(event);

        if (recognitionRef.current !== recognition) return;

        setIsListening(false);

        if (
          event.error === "not-allowed"
        ) {
          setError(
            "Allow microphone permission from browser settings"
          );
        } else if (
          event.error === "network"
        ) {
          setError(
            "Speech recognition network error"
          );
        } else if (event.error === "no-speech") {
          // normal hai - koi error mat dikhao
          setAiStatus("Waiting");
        } else {
          setError(
            "Microphone error occurred"
          );
        }
      };

      recognition.onresult = (event) => {
        let transcript = "";

        for (
          let i = 0;
          i < event.results.length;
          i++
        ) {
          transcript +=
            event.results[i][0]
              .transcript + " ";
        }

        setAnswer(transcript);

        answerRef.current = transcript;

        const confidence = Math.min(
          Math.floor(
            transcript.length * 1.1
          ),
          100
        );

        setConfidenceLevel(confidence);
      };

      recognition.start();
    } catch (err) {
      console.log(err);

      setError(
        "Please allow microphone access"
      );
    }
  };

  // =========================================
  // STOP LISTENING
  // =========================================
  const stopListening = () => {
    try {
      if (recognitionRef.current) {
        const r = recognitionRef.current;
        r.onend = null;
        r.stop();
      }

      setIsListening(false);

      setAiStatus("Waiting");
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================
  // MOVE NEXT QUESTION
  // =========================================
  const moveNextQuestion = async () => {
    try {
      if (
        currentQuestion <
        questions.length - 1
      ) {
        // FIX FEEDBACK BUG:
        // pehle feedback/answer CLEAR karo, tab question badlo
        setCurrentFeedback("");
        setCurrentScore(0);
        setAnswer("");
        answerRef.current = "";
        setConfidenceLevel(0);
        setError("");
        setIsAISpeaking(false);
        setFeedbackSpeaking(false);
        synthRef.current.cancel();
         setLoading(false);
      loadingRef.current = false;
      submitCalledRef.current = false;

        // 1 tick baad question increment
        setTimeout(() => {
          setCurrentQuestion((prev) => prev + 1);
        }, 50);

      } else {
        // LAST QUESTION - FINISH INTERVIEW
        setLoading(true);

        const finishResponse =
          await axios.post(
            `${ServerUrl}/api/interview/finish`,
            {
              interviewId,
              answers: allAnswersRef.current,
            },
            {
              withCredentials: true,
            }
          );

        const reportData = {
          ...interviewData,
          finalScore:
            finishResponse?.data?.finalScore || 0,
          answered:
            finishResponse?.data?.answered ?? 
            allAnswersRef.current.length,
          total: questions.length,
          reportAnswers:
            finishResponse?.data?.reportAnswers?.length
              ? finishResponse.data.reportAnswers
              : allAnswersRef.current,
        };

        // CRITICAL: Call onFinish to trigger Step 3
        onFinish(reportData);
      }
    } catch (err) {
      console.error("Move next question error:", err);
      setError(
        err?.response?.data?.message ||
        "Failed to proceed to next question"
      );
      setLoading(false);
    }
  };

  // =========================================
  // SUBMIT ANSWER
  // =========================================
  const handleSubmitAnswer = async (
    autoSubmit = false
  ) => {
    try {
      if (loadingRef.current) return;

      const currentAnswer = answerRef.current;

      if (
        !currentAnswer?.trim() &&
        !autoSubmit
      ) {
        setError(
          "Please answer first"
        );
        return;
      }

      setLoading(true);
      loadingRef.current = true;

      stopListening();

      const response =
        await axios.post(
          `${ServerUrl}/api/interview/submit-answer`,
          {
            interviewId,
            questionIndex:
              currentQuestion,
            answer:
              currentAnswer || "No Answer",
          },
          {
            withCredentials: true,
          }
        );

      const feedback =
        response?.data?.evaluation
          ?.feedback || "";

      const score =
        response?.data?.evaluation
          ?.score || 0;

      // FIX REPORT BUG: locally bhi save karo
      allAnswersRef.current.push({
        question: currentQ?.question || "",
        answer: currentAnswer || "No Answer",
        feedback,
        score,
        type: currentQ?.type || "General",
      });

      setCurrentFeedback(feedback);

      setCurrentScore(score);

      // SPEAK COMPLETE FEEDBACK
      if (feedback) {
        setFeedbackSpeaking(true);

        setTimeout(() => {
          speakText(
            feedback,
            async () => {
              setFeedbackSpeaking(
                false
              );

              setTimeout(async () => {
                await moveNextQuestion();
              }, 1800);
            }
          );
        }, 1000);
      } else {
        setTimeout(async () => {
          await moveNextQuestion();
        }, 2500);
      }
    } catch (err) {
      console.error("Submit answer error:", err);

      setError(
        err?.response?.data
          ?.message ||
          "Submission failed"
      );
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // =========================================
  // UI
  // =========================================
  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-5 lg:px-8">

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-6">

        {/* LEFT PANEL */}
        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="rounded-[30px] overflow-hidden border border-white/10 bg-[#0B1023]/95 backdrop-blur-2xl"
        >

          {/* VIDEO */}
          <div className="relative h-[300px] overflow-hidden">

            <video
              src={malevideo}
              autoPlay
              muted
              loop
              playsInline
              className={`w-full h-full object-cover transition-all duration-700 ${
                isAISpeaking
                  ? "scale-[1.04]"
                  : "scale-100"
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent" />

            {/* STATUS */}
            <div className="absolute top-4 right-4">

              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl">

                <div
                  className={`w-3 h-3 rounded-full ${
                    isAISpeaking
                      ? "bg-emerald-400 animate-pulse"
                      : isListening
                      ? "bg-cyan-400 animate-pulse"
                      : "bg-gray-400"
                  }`}
                />

                <span className="text-sm font-semibold">
                  {aiStatus}
                </span>

              </div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-black">
                  Live Analytics
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  AI tracking system
                </p>

              </div>

              <HiMiniChartBar className="text-3xl text-cyan-400" />

            </div>

            {/* TIMER */}
            <div className="flex justify-center mt-7">

              <div className="w-28 h-28">

                <CircularProgressbar
                  value={timeLeft}
                  maxValue={
                    currentQ?.timeLimit ||
                    120
                  }
                  text={`${timeLeft}s`}
                  styles={buildStyles({
                    pathColor: "#00E5FF",
                    textColor: "#fff",
                    trailColor:
                      "rgba(255,255,255,0.08)",
                    textSize: "16px",
                  })}
                />

              </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 mt-7">

              <div className="rounded-3xl border border-white/10 bg-[#11182E] p-5">

                <h2 className="text-2xl font-black text-cyan-400">
                  {confidenceLevel}%
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Confidence
                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-[#11182E] p-5">

                <h2 className="text-2xl font-black text-emerald-400">
                  {currentScore}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  AI Score
                </p>

              </div>

            </div>

            {/* PROGRESS */}
            <div className="mt-7">

              <div className="flex items-center justify-between mb-3">

                <span className="text-sm text-gray-400">
                  Progress
                </span>

                <span className="text-cyan-400 font-bold">
                  {Math.round(progress)}%
                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${progress}%`,
                  }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                />

              </div>

            </div>

          </div>

        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-[30px] border border-white/10 bg-[#0B1023]/95 backdrop-blur-2xl p-6 lg:p-9"
        >

          {/* HEADER */}
          <div className="flex flex-wrap justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">

                <RiRobot2Fill className="text-4xl text-white" />

              </div>

              <div>

                <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI Interview
                </h1>

                <p className="text-sm text-gray-400 mt-1">
                  Welcome back, {userName}
                </p>

              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-[#11182E] px-6 py-4">

              <div className="flex items-center gap-4">

                <HiMiniBolt className="text-yellow-400 text-3xl" />

                <div>

                  <p className="text-gray-400 text-sm">
                    Current Round
                  </p>

                  <h2 className="text-xl font-black">
                    {currentQuestion + 1}
                    {" / "}
                    {questions.length}
                  </h2>

                </div>

              </div>

            </div>

          </div>

          {/* QUESTION */}
          <motion.div
            key={currentQuestion}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8 rounded-[28px] border border-white/10 bg-[#11182E] p-7"
          >

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">

                <HiMiniCpuChip className="text-3xl text-cyan-400" />

              </div>

              <div>

                <p className="text-sm text-gray-400">
                  Technical Question
                </p>

                <h2 className="font-bold text-lg">
                  AI Challenge
                </h2>

              </div>

            </div>

            <h2 className="text-xl lg:text-2xl font-black leading-relaxed text-gray-100">
              {currentQ?.question}
            </h2>

          </motion.div>

          {/* ANSWER */}
          <div className="mt-7">

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
              placeholder="Type or speak your answer..."
              className="w-full h-[250px] lg:h-[280px] rounded-[28px] border border-white/10 bg-[#11182E] p-6 text-base text-white placeholder:text-gray-500 outline-none resize-none focus:border-cyan-400 transition-all"
            />

          </div>

          {/* ERROR */}
          {error && (

            <div className="mt-4 text-red-400 text-sm font-medium">
              {error}
            </div>

          )}

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-between items-center gap-5 mt-7">

            <div className="flex flex-wrap gap-4">

              {!isListening ? (

                <motion.button
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={
                    startListening
                  }
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold"
                >

                  <HiMiniMicrophone className="text-xl" />

                  Start Speaking

                </motion.button>

              ) : (

                <motion.button
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={
                    stopListening
                  }
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 font-bold"
                >

                  <HiMiniStop className="text-xl" />

                  Stop Speaking

                </motion.button>

              )}

              <button
                onClick={() =>
                  speakText(
                    currentQ?.question
                  )
                }
                className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/10 bg-[#11182E] hover:bg-[#1a2340] transition-all font-bold"
              >

                <HiMiniSpeakerWave className="text-xl" />

                Replay AI

              </button>

            </div>

            <motion.button
              whileTap={{
                scale: 0.97,
              }}
              disabled={
                loading ||
                feedbackSpeaking
              }
              onClick={() =>
                handleSubmitAnswer()
              }
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-black text-base disabled:opacity-50"
            >

              {loading
                ? "Analyzing..."
                : currentQuestion ===
                  questions.length - 1
                ? "Finish Interview"
                : "Submit & Next"}

            </motion.button>

          </div>

          {/* FEEDBACK */}
          <AnimatePresence>

            {currentFeedback && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                className="mt-8 rounded-[28px] border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-6"
              >

                <div className="flex items-center gap-4 mb-5">

                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center">

                    <HiMiniCheckBadge className="text-3xl text-white" />

                  </div>

                  <div>

                    <h2 className="text-xl font-black text-emerald-400">
                      AI Feedback
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                      Real-time evaluation
                    </p>

                  </div>

                </div>

                <p className="text-base leading-relaxed text-gray-200">
                  {currentFeedback}
                </p>

              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>

      </div>

    </div>
  );
};

export default Step2Interview;