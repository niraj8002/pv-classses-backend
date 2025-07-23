const express = require("express");
const { authorize, protect } = require("../middleware/auth");
const { sendQurey, getQueries } = require("../controllers/contactus");

const router = express.Router();

router.route("/send-query").post(sendQurey);
router.route("/get-query").get(protect, authorize("admin"), getQueries);

module.exports = router;
