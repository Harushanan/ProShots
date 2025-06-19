const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_uploads",
    allowed_formats: ["jpg", "png", "pdf", "mp3", "webm"],
  },
});

const upload = multer({ storage });
module.exports = upload;
 

