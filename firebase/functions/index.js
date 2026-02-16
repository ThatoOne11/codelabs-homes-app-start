const { createUser, deleteUser } = require("./features/user");
const { addToCart } = require("./features/cart");

// Export them for Firebase
module.exports = {
  createUser,
  deleteUser,
  addToCart,
};
