const functions = require("firebase-functions");

exports.addToCart = functions.https.onRequest((req, res) => {
  res.send("Item added to cart v1");
});
