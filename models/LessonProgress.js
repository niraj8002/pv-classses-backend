const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  lesson: {
    type: mongoose.Schema.ObjectId,
    ref: "Lesson",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  watchTime: {
    type: Number,
    default: 0,
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to ensure unique progress tracking
lessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);
