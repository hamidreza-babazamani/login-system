function validateRegister(req, res, next) {
  const { email, password, confirmPassword } = req.body;

  // --- Email ---
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (typeof email !== "string") {
    return res.status(400).json({ message: "Email must be a string" });
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return res.status(400).json({ message: "Email cannot be empty" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ message: "Email is invalid" });
  }

  // --- Password ---
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (typeof password !== "string") {
    return res.status(400).json({ message: "Password must be a string" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }
  if (password.includes(" ")) {
    return res
      .status(400)
      .json({ message: "Password must not contain spaces" });
  }

  // --- Confirm Password ---
  if (!confirmPassword) {
    return res.status(400).json({ message: "Confirm password is required" });
  }
  if (typeof confirmPassword !== "string") {
    return res
      .status(400)
      .json({ message: "Confirm password must be a string" });
  }
  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // پاس دادن داده تمیز به controller
  req.validatedData = { email: cleanEmail, password };
  next();
}

module.exports = { validateRegister };
