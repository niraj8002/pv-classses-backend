const Review = require("../models/Review");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// @desc    Get all reviews for a course
// @route   GET /api/courses/:courseId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const courseId = await Course.findOne({ slug: req.params.courseId });
    const reviews = await Review.find({ course: courseId._id })
      .populate("user", "name avatar" )
      .sort("-createdAt");
    // console.log(req.params);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id....(reviews/:id)
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name")
      .populate("course", "title");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Create review
// @route   POST /api/courses/:courseId/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.courseId });
    // console.log(req.params);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: course._id,
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "You must be enrolled in the course to leave a review",
      });
    }

    // Check if user has already reviewed this course
    const existingReview = await Review.findOne({
      user: req.user.id,
      course: course._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    req.body.user = req.user.id;
    req.body.course = course._id;

    const review = await Review.create(req.body);

    // Update course rating
    await updateCourseRating(course._id);

    res.status(201).json({
      message: "Review created successfully",
      success: true,
      data: review,
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
        message: "You have already reviewed this course",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Update course rating
    await updateCourseRating(review.course);

    res.status(200).json({
      success: true,
      data: review,
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
        message: "You have already reviewed this course",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const courseId = review.course;
    await review.deleteOne();

    // Update course rating
    await updateCourseRating(courseId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Helper function to update course rating
const updateCourseRating = async (courseId) => {
  const reviews = await Review.find({ course: courseId });

  if (reviews.length === 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      totalReviews: 0,
    });
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Course.findByIdAndUpdate(courseId, {
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length,
    });
  }
};
