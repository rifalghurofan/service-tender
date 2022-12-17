const mongoose = require("mongoose");
require("dotenv").config();
// connect to database
const connect = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});
module.exports = connect;
