const express = require("express");

const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/cart.controllers.js");

const CartRouter = express.Router();

CartRouter.post("/add", addToCart);

CartRouter.post("/remove", removeFromCart);

CartRouter.get("/", getCart);

module.exports = CartRouter;
