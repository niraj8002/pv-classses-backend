const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a course title"],
    trim: true,
    maxlength: [150, "Title cannot be more than 150 characters"],
  },
  slug: {
    type: String,
    required: [true, "Please add a slug"],
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    default: 0.0,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  duration: {
    type: String,
    default: null,
  },
  totalLessons: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for text search
courseSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Course", courseSchema);
