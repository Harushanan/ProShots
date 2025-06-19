export const validateStockForm = (name, price, currentQuantity) => {
  // Validate item name
  if (!name || !isNaN(name)) {
    return "Item name must be a valid string, not a number.";
  }

  // Validate price
  if (isNaN(price)) {
    return "Price must be a valid number.";
  }
  if (parseFloat(price) <= 0) {
    return "Price must be greater than 0.";
  }

  // Validate current quantity
  if (isNaN(currentQuantity)) {
    return "Current quantity must be a valid number.";
  }
  if (parseInt(currentQuantity) < 0) {
    return "Current quantity must be 0 or greater.";
  }

  return null; 
};