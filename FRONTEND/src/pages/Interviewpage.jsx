import { useState } from "react";
import Navbar from "../components/Navbar";
import Step1SetUp from "../components/Step1SetUp";
import Step2Interview from "../components/Step2Interview";
import Step3Report from "../components/Step3Report";

const Interviewpage = () => {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  const handleRestart = () => {
    setStep(1);
    setInterviewData(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      <Navbar />
      <div className="pt-32">
        {step === 1 && (
          <Step1SetUp
            onStart={(data) => {
              setInterviewData(data);
              setStep(2);
            }}
          />
        )}

        {step === 2 && interviewData && (
          <Step2Interview
            interviewData={interviewData}
            onFinish={(report) => {
              setInterviewData(report);
              setStep(3);
            }}
          />
        )}

        {step === 3 && interviewData && (
          <Step3Report 
            reportData={interviewData}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default Interviewpage;