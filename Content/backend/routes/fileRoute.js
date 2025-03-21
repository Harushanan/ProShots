const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const upload = require("../config/multerConfig"); 


router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/files", fileController.getFiles);
router.delete("/file/:id", fileController.deleteFile);

module.exports = router;
