function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Valid email is required" });
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return res.status(400).json({ message: "Email cannot be empty" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Valid password is required" });
  }

  req.validatedData = { email: cleanEmail, password };
  next();
}

module.exports = { validateLogin };
