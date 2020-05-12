const mongoose = require("mongoose");

const Record = mongoose.model(
  "Record",
  new mongoose.Schema({
    arrivaltime: Date,
    departuretime: Date,
    duration: Number,
    vehicle :{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Vehicle'
    }
  })
);

module.exports = Record;