const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add a lesson title"],
    trim: true,
    maxlength: [150, "Title cannot be more than 150 characters"],
  },
  content: {
    type: String,
    required: [true, "Please add lesson content"],
  },
  videourl: {
    type: String,
    default: null,
  },
  order: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    default: null,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  // resources: [{
  //   title: String,
  //   url: String,
  //   type: {
  //     type: String,
  //     enum: ['pdf', 'video', 'link', 'document']
  //   }
  // }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lesson", lessonSchema);
