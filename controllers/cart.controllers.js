const CartModel = require("../models/cart.model.js");

// ! Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.userData._id;

    // Check if cart exists
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      // Cart doesn't exist — create it
      cart = await CartModel.create({
        userId,
        products: [{ productId, qty }],
      });
    } else {
      // Cart exists — update or add product
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Product exists — increase qty
        cart.products[productIndex].qty += qty;
        await cart.save();
      } else {
        // Product not in cart — push new item
        cart.products.push({ productId, qty });
        await cart.save();
      }
    }

    // Re-fetch updated cart with populated product
    const updatedCart = await CartModel.findOne({ userId }).populate("products.productId");

    // Get the updated/added product from populated cart
    const updatedProduct = updatedCart.products.find(
      (product) => product.productId._id.toString() === productId
    );

    res.json({
      success: true,
      message: "Item added to cart successfully",
      product: updatedProduct, // populated product info + qty
    });
  } catch (error) {
    console.error("Error in cart add route", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ! Decrease from cart
// payload => {productId, qty}
const removeFromCart = async (req, res) => {
  // ToDo: Validation of payload   item exists or not, payload valid or not
  // 1. If qty is > 1 => decrese qty (user press - btn in front)
  // 2. if qty == 1 => Remove/pull from cart (user press - btn in front)
  // 3. if qty == req.body.qty pull (user press remove from cart btn in front)
  // if user clicks remove from cart button send qty = procust qty in payload
  // if user clicks - btn send qty = 1 in payload
  const cart = await CartModel.findOne({ userId: req.userData._id });
  const productIndex = cart.products.findIndex(
    (product) => product.productId == req.body.productId
  );

  if (cart.products[productIndex].qty <= req.body.qty) {
    console.log("Product to be pulled");
    await CartModel.findByIdAndUpdate(cart._id, {
      $pull: {
        products: {
          productId: req.body.productId,
        },
      },
    });
  } else {
    console.log("Product qty to be decreased");
    cart.products[productIndex].qty -= req.body.qty;
    await cart.save();
  }
  res.json({
    success: true,
    message: "Cart item removed successfully",
  });
};

// ! Get cart
// payload => not possible as a get API
const getCart = async (req, res) => {
  const products = await CartModel.findOne({
    userId: req.userData._id,
  }).populate("products.productId");

  res.json({
    success: true,
    message: "Cart items got",
    products,
  });
};

const cartControllers = {
  addToCart,
  removeFromCart,
  getCart,
};

module.exports = cartControllers;
