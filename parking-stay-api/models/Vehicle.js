const mongoose = require('mongoose')

const Vehicle = mongoose.model(
  "Vehicle",
  new mongoose.Schema({
    carplate: String,
    records: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Record"
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
  })
);

module.exports = Vehicle;