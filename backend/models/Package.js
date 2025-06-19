const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageHead: {
    type: String,
    required: true,
    trim: true
  },
  packageSubhead: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sessionPeriod: {
    type: String,
    required: true,
    trim: true
  },
  noOfCameraman: {
    type: Number,
    required: true,
    min: 1
  },
  photoCount: {
    type: Number,
    required: true,
    min: 0
  },
  albumDetails: {
    type: String,
    required: true,
    trim: true
  },
}, {
  timestamps: true // adds createdAt and updatedAt
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
