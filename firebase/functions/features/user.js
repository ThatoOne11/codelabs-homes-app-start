const functions = require("firebase-functions");

exports.createUser = functions.https.onRequest((req, res) => {
  res.send("User Created v2");
});

exports.deleteUser = functions.https.onRequest((req, res) => {
  res.send("User Deleted v1");
});
