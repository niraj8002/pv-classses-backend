const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Route imports
const connectMongoDB = require("./db/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const courseRoutes = require("./routes/courses");
const lessonRoutes = require("./routes/lessons");
const enrollmentRoutes = require("./routes/enrollments");
const reviewRoutes = require("./routes/reviews");
const paymentRoutes = require("./routes/payments");
const lessonProgress = require("./routes/lessonProgress");
const contactus = require("./routes/contactus");
// Error handler middleware
const errorHandler = require("./middleware/error");

const app = express();
connectMongoDB;
// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Update with your client URL
    credentials: true, // Allow cookies if needed
  })
);

// Serving static thumbnails with CORS headers
app.use(
  "/thumbnail",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from your frontend
    next();
  },
  express.static(path.join(__dirname, "public/upload/thumbnail"))
);

// CORS
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static files
app.use("/upload", express.static(path.join(__dirname, "public/upload")));
app.use(
  "/thumbnail",
  express.static(path.join(__dirname, "public/upload/thumbnail"))
);

// Routes
app.use("/api/auth", authRoutes);
// admin aoute
app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses/:courseId/lessons", lessonRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons/progress", lessonProgress);
// done upper
app.use("/api/courses/:courseId/reviews", reviewRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/query", contactus);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler (should be last piece of middleware)
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});
