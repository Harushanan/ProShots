/**
 * Validates the product name.
 * @param {string} name - The product name to validate.
 * @returns {string|null} - Returns an error message if validation fails, otherwise null.
 */
export const validateProductName = (name) => {
  if (!name || name.trim() === "") {
    return "Product name is required.";
  }

  // Regex to check if the name contains at least one alphabet
  const regex = /^(?![0-9]*$)[a-zA-Z0-9 ]+$/;

  if (!regex.test(name)) {
    return "Product name must contain at least one letter and cannot be only numbers.";
  }

  return null; // Return null if the validation passes
};

/**
 * Validates the product image.
 * @param {File} image - The image file to validate.
 * @returns {string|null} - Returns an error message if validation fails, otherwise null.
 */
export const validateProductImage = (image) => {
  if (!image) {
    return "Product image is required.";
  }

  // Check if the file is an image
  if (!image.type || !image.type.startsWith("image/")) {
    return "Please upload a valid image file.";
  }

  // Check file size (optional: limit to 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (image.size > maxSize) {
    return "Image size must be less than 5MB.";
  }

  return null; // Return null if the validation passes
};
//