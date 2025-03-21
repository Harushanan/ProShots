import { toast } from "react-toastify";

// Constants for file size limits (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

/**
 * Validates the size of an image file.
 * @param {File} file - The image file to validate.
 * @returns {boolean} - Returns true if the file is valid, otherwise false.
 */
export const validateImageSize = (file) => {
  if (file.size > MAX_IMAGE_SIZE) {
    toast.error(
      `Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`
    );
    return false;
  }
  return true;
};

/**
 * Validates the size of a video file.
 * @param {File} file - The video file to validate.
 * @returns {boolean} - Returns true if the file is valid, otherwise false.
 */
export const validateVideoSize = (file) => {
  if (file.size > MAX_VIDEO_SIZE) {
    toast.error(
      `Video size must be less than ${MAX_VIDEO_SIZE / 1024 / 1024}MB.`
    );
    return false;
  }
  return true;
};
