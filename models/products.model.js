const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 99999999
    },
    discountPercentage: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
      default: 0,
    },
    rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
      default: -1,
    },
    stock: {
      type: Number,
      required: true,
      min: 1,
      max: 99999999,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("products", productSchema);
module.exports = ProductModel
