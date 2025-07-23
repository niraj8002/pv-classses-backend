const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const checkEnrollment = async (req, res, next) => {
  const courseSlug = req.params.courseId;
  // console.log(courseSlug);
  const course = await Course.findOne({ slug: courseSlug });

  if (!course) {
    return res.status(400).json({
      success: false,
      message: "Course Slug is required",
    });
  }
  // console.log(req.user.id);

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
      message: "Server error",
    });
  }
};

module.exports = checkEnrollment;
