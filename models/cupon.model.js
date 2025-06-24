const mongoose = require("mongoose");

const cuponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  maxDixcountValue: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  minOrderValue: {
    type: Number,
    required: true,
  },
  
});

const CuponModel = mongoose.model("cupons", cuponSchema);

module.exports = CuponModel;
