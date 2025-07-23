const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const checkEnrollment = async (req, res, next) => {
  const courseSlug = req.params.courseId;

  const course = await Course.findOne({ slug: courseSlug });

  if (!course) {
    return res.status(400).json({
      success: false,
      message: "Course Slug is invalid or missing",
    });
  }

  // ✅ Set course ID in request for further use
  req.course = course;

  // 🛡️ If user is not logged in, skip enrollment check but allow access
  if (!req.user) {
    req.isEnrolled = false;
    return next();
  }

  try {
    const isEnrolled = await Enrollment.findOne({
      user: req.user.id,
      course: course._id,
    });

    req.isEnrolled = !!isEnrolled;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking enrollment",
    });
  }
};

module.exports = checkEnrollment;
