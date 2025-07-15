const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  searchCourses,
} = require("../controllers/courses");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/multer");
const router = express.Router();

router
  .route("/").get(getCourses).post(upload.single("thumbnail"),protect,authorize("instructor", "admin"),
    createCourse
  );

router.route("/search").get(searchCourses);

router.route("/instructor/:instructorId").get(getInstructorCourses);

router
  .route("/:id")
  .get(getCourse)
  .put(
    upload.single("thumbnail"),
    protect,
    authorize("instructor", "admin"),
    updateCourse
  )
  .delete(protect, authorize("instructor", "admin"), deleteCourse);

module.exports = router;
