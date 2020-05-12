const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: String,
    description: String,
    byMonth: Boolean,
    percent: Number,
  })
);

module.exports = Category;