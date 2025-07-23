const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// get all lessons
exports.getallLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().sort("order");
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all lessons for a course
// @route   GET /api/courses/:courseId/lessons
// @access  Public

exports.getLessons = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.courseId });
    const lessons = await Lesson.find({ course: course._id }).sort("order");

    res.status(200).json({
      message: `Lessons for course `,
      success: true,
      isEnrolled: req.isEnrolled,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate(
      "course",
      "title instructor"
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Create new lesson
// @route   POST /api/courses/:courseId/lessons
// @access  Private
exports.createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ slug: courseId });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const lesson = await Lesson.create({
      ...req.body,
      course: course._id, // use the ObjectId here
    });

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Lesson with this title already exists",
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate("course");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not  found",
      });
    }

    // Check if user is course owner
    if (
      lesson.course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "User not authorized to update this lesson",
      });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Lesson with this title already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Check if user is course owner
    if (
      lesson.course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "User not authorized to delete this lesson",
      });
    }

    await lesson.deleteOne();

    // Update course totalLessons
    await Course.findByIdAndUpdate(lesson.course._id, {
      $inc: { totalLessons: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
