const express = require("express");
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  getallLessons,
} = require("../controllers/lessons");
const { protect, authorize } = require("../middleware/auth");
const checkEnrollment = require("../middleware/checkEnrollment");
const optionalProtect = require("../middleware/optionalProtect");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(optionalProtect, checkEnrollment, getLessons)
  .post(protect, authorize("instructor", "admin"), createLesson);

router.route("/all_lessons").get(getallLessons);

router
  .route("/:id")
  .get(getLesson)
  .put(protect, authorize("instructor", "admin"), updateLesson)
  .delete(protect, authorize("instructor", "admin"), deleteLesson);

module.exports = router;
