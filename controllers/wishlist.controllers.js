const WishlistModel = require("../models/wishlist.model");

const add = async (req, res) => {
  // payload => {productId, qty}
  /* 
    1. if user already have an wishlist in db add product to that
      1.1 if product already exsists increase the qty 
      1.2 add new product
    2. create a new wishlist
    */
  //    find user by user._id
  try {
    const wishlist = await WishlistModel.findOne({ userId: req.userData._id });
    if (!wishlist) {
      console.log("creating wishist");

      await WishlistModel.create({
        userId: req.userData._id,
        products: [{ productId: req.body.productId, qty: req.body.qty }],
      });
    } else {
      console.log("addid product");

      const existingProductIdx = wishlist.products.findIndex(
        (product) => product.productId == req.body.productId
      );
      if (existingProductIdx != -1) {
        console.log("increasing qty");
        // increase qty
        wishlist.products[existingProductIdx].qty += req.body.qty;
      } else {
        console.log("pushing product");

        // add product
        wishlist.products.push({
          productId: req.body.productId,
          qty: req.body.qty,
        });
      }
      await wishlist.save();
    }
    res.json({
      success: true,
      message: "wishlist added",
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: "Error in adding product",
      from: "add to wishlist api",
      error,
    });
  }
};

//
const remove = async (req, res) => {
  // payload =>  {prodictId, qty}
  /*
    0. find the user hhas any wishlist oir not
    1. find the product exists
    2. if non existing product throw error
    3. if exixts
      3.1 check qty
      3.2 if req.body.qty >= product qty -> pull the product
      3.3 other wise decrease qty
    */
  const wishlist = await WishlistModel.findOne({ userId: req.userData._id });
  //    0
  if (!wishlist) {
    return res.status(400).json({
      success: false,
      message: "User don't have any wishlist",
    });
  }

  // 1
  const existingProductIdx = wishlist.products.findIndex(
    (product) => {
       return product.productId == req.body.productId
    }
  );

  //   2
  if (existingProductIdx == -1) {
    return res.status(400).json({
      success: false,
      message: "Product does not exists in wishlist",
    });
  } else {
    // check qty -> compare qty -> perfrom decrement
    const productQty = wishlist.products[existingProductIdx].qty;
    if (productQty <= req.body.qty) {
      wishlist.products.splice(existingProductIdx, 1);
    } else {
      wishlist.products[existingProductIdx].qty -= req.body.qty;
    }
    await wishlist.save();
    // if no products after removals delete the document
    if(wishlist.products.length === 0){
       await WishlistModel.findByIdAndDelete(wishlist._id)
    }
  }
  res.json({
    success: true,
    message: "wishlist removed",
  });
};

//
const list = async (req, res) => {
  // find wishlist with user._id -> send whishlist.products with populated products
  try {
    const wishlist = await WishlistModel.findOne({
      userId: req.userData._id,
    }).populate("products.productId");

    if (!wishlist) {
      return res.status(400).json({
        success: false,
        message: "User don't have any wishlist",
      });
    }

    res.json({
      success: true,
      message: "wishlist list",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Can not fetch lists from DB",
      from: "get wishlists api",
      error,
    });
  }
};

const wishlistCntrollers = {
  add,
  remove,
  list,
};

module.exports = wishlistCntrollers;
