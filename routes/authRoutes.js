const express = require("express");
const { validateRegister } = require("../middleware/validateRegister");
const { validateLogin } = require("../middleware/validateLogin");
const { authenticate } = require("../middleware/auth");
const {
  register,
  login,
  refresh,
  logout,
  me,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, me);

module.exports = router;
