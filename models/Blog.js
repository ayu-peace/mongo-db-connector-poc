const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  blogId: String,
  blogParent: String
  
});

module.exports = mongoose.model("Blog", blogSchema);
