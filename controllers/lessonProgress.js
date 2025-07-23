const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");

// @desc    Get lesson progress for a user
// @route   GET /api/lessons/progress/:lessonId
// @access  Private
exports.updateLessonProgress = async (req, res, next) => {
  try {
    const { lessonId, completed, watchTime } = req.body;
    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required",
      });
    }
    const findlesson = await Lesson.findById(lessonId);

    if (!findlesson) {
      return res.status(404).json({
        success: false,
        message: "lesson not found",
      });
    }

    let progress = await LessonProgress.findOne({
      user: req.user.id,
      lesson: lessonId,
    });

    if (progress) {
      progress.completed = completed ?? progress.completed;
      progress.watchTime = watchTime ?? progress.watchTime;
      progress.lastWatchedAt = new Date();
      if (completed && !progress.completedAt) {
        progress.completedAt = new Date();
      }
      await progress.save();
    } else {
      // create
      progress = await LessonProgress.create({
        user: req.user.id,
        lesson: lessonId,
        completed,
        watchTime,
        completedAt: completed ? new Date() : null,
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    // console.log(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server hjError",
    });
  }
};
