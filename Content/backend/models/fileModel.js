const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true }, 
  publicId: { type: String, required: true }, 
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
