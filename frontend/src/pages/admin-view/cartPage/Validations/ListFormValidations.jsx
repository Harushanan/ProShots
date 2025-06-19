/**
 * Validates the product name.
 * @param {string} 
 * @returns {string|null} 
 */
export const validateProductName = (name) => {
  if (!name || name.trim() === "") {
    return "Product name is required.";
  }

  
  // Regex to check if the name contains at least one alphabet
  const regex = /^(?![0-9]$)[a-zA-Z0-9 _\-.,@#$%^&()!]+$/;

  if (!regex.test(name)) {
    return "Product name must contain at least one letter and cannot be only numbers.";
  }

  return null; 
};

/**
 * Validates the product image.
 * @param {File} 
 * @returns {string|null} 
 */
export const validateProductImage = (image) => {
  if (!image) {
    return "Product image is required.";
  }

  
  if (typeof image === "string") {
    return null;
  }

  
  if (!image.type || !image.type.startsWith("image/")) {
    return "Please upload a valid image file (e.g., JPEG, PNG).";
  }

  // Check file size (limit to 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (image.size > maxSize) {
    return "Image size must be less than 5MB.";
  }

  return null; 
};

/**
 * Validates the product price.
 * @param {number} 
 * @returns {string|null} 
 */
export const validateProductPrice = (price) => {
  if (price === "" || isNaN(price)) {
    return "Price is required.";
  }

  if (price < 100) {
    return "Price must be at least 100.";
  }

  return null; 
};