import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

import axios from "axios";
import { useEffect } from "react";
import HistoryPage from "./pages/HistoryPage";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

import { Toaster } from "react-hot-toast";
import Interviewpage from "./pages/Interviewpage"
import ScrollToTop from "./components/ScrollToTop";

export const ServerUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(
      `${ServerUrl}/api/user/current-user`,
          {
            withCredentials: true,
          }
        );

        dispatch(setUserData(result.data.user));

        console.log("Current User:", result.data.user);

      } catch (error) {
        console.error("Error fetching user data:", error);

        dispatch(setUserData(null));
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <>
      {/* TOASTER */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "14px 18px",
            fontSize: "14px",
          },
        }}
      />

      {/* AUTO SCROLL TOP */}
      <ScrollToTop />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/interview" element={<Interviewpage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </>
  );
};

export default App;