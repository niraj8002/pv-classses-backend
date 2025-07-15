const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 🔁 Custom logic: kis folder me save karein
    let uploadPath;

    if (file.fieldname === "avatar") {
      uploadPath = "public/upload";
    } else if (file.fieldname === "thumbnail") {
      uploadPath = "public/upload/thumbnail";
    } else {
      uploadPath = "public/upload/others";
    }

    // ❗ Make sure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

// Filter: only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Sirf image file allow hai"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
