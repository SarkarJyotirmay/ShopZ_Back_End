const express = require("express");

const {
  addToCart,
  removeFromCart,
  getCart,
  clearCart
} = require("../controllers/cart.controllers.js");

const CartRouter = express.Router();

CartRouter.post("/add", addToCart);

CartRouter.post("/remove", removeFromCart);

CartRouter.get("/", getCart);

CartRouter.delete("/clear-cart", clearCart)



module.exports = CartRouter;
