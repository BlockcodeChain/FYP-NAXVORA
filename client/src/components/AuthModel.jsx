import { useEffect } from "react";
import { useSelector } from "react-redux";

const AuthModel = ({ onClose }) => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose?.();
    }
  }, [userData, onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-2xl"
      >
        ✕
      </button>

      {/* Modal Box */}
      <div className="w-full max-w-md rounded-2xl bg-[#111827] p-6 text-white shadow-xl border border-white/10">
        
        <h2 className="text-xl font-bold mb-2">
          Authentication Required
        </h2>

        <p className="text-sm text-gray-400">
          Please login to continue
        </p>

      </div>
    </div>
  );
};

export default AuthModel;