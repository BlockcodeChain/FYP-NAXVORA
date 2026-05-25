import User from "../models/usermodel.js";
import  generateToken from "../utils/token.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1. check user exists
    let user = await User.findOne({ email });

    // 2. if not exists → create
    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    // 3. generate token
    const token = generateToken(user._id);

    // 4. set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Success",
      user,
      token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const logOut = async (req, res) => {
  try {
  res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
});

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.error("Logout failed:", err);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};