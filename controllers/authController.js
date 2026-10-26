const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/* ---------- Helper: تولید توکن‌ها ---------- */
function generateAccessToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
}

/* ---------- Register ---------- */
async function register(req, res) {
  try {
    const { email, password } = req.validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ email, password: passwordHash });

    return res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ---------- Login ---------- */
async function login(req, res) {
  try {
    const { email, password } = req.validatedData;

    // +password چون select: false گذاشتیم
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ذخیره هش refresh token در دیتابیس
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = refreshHash;
    await user.save();

    // refresh token در httpOnly cookie (امن‌تر از localStorage)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ---------- Refresh ---------- */
async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.id).select("+refreshToken");
    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // چرخش توکن (rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ---------- Logout ---------- */
async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await User.findByIdAndUpdate(payload.id, { refreshToken: null });
      } catch {
        // توکن معتبر نبود، کاری نمی‌کنیم
      }
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ---------- Me (تست authenticate) ---------- */
async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { register, login, refresh, logout, me };
