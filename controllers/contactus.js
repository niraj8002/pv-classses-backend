const contactus = require("../models/contactus");

exports.sendQurey = async (req, res) => {
  try {
    const { fullName, email, message, phoneNumber } = req.body;

    // Validate input
    if (!fullName || !email || !message || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const contactUs = new contactus({
      fullName,
      email,
      phoneNumber,
      message,
    });
    await contactUs.save();
    res.status(200).json({
      success: true,
      message: "Query sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all queries
// @route   GET /api/contactus
// @access  Private (Admin)
exports.getQueries = async (req, res) => {
  try {
    const queries = await contactus.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: queries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
