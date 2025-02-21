const express = require("express");
const router = express.Router();
const {
  register,
  login,
} = require("../controllers/hospitalRegcontroller");
const {validateToken} = require("../middleware/authMiddleware");

// Public routes
// router.get("/validate",authMiddleware);
router.post("/register", register);//
router.post("/login", login);//


module.exports = router;
