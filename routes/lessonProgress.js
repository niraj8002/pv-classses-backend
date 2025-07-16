const express = require("express");
const { protect } = require("../middleware/auth");
const { updateLessonProgress } = require("../controllers/lessonProgress");

const router = express.Router();

router.use(protect);

router.route("/").post(updateLessonProgress);
module.exports = router;
