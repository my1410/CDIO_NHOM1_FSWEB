const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const {
  getAiRecommendation,
  imageSearch,
} = require("../controllers/aiController");

router.post("/recommend", getAiRecommendation);

router.post(
  "/image-search",
  upload.single("image"),
  (req, res, next) => {
    console.log("REQ FILE:", req.file);
    console.log("REQ BODY:", req.body);
    next();
  },
  imageSearch,
);

module.exports = router;
