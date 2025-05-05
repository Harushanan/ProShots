const express = require("express");
const router = express.Router();
const { searchSimilarImages } = require("../controls/inventory/imageSearchController");

router.post("/search", searchSimilarImages);

module.exports = router;
