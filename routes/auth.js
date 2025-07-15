const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updatePassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/updateprofile", upload.single("avatar"), protect, updateProfile);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
