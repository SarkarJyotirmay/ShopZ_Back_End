/*
Order Algo
0. check if cart is valaibalbe
1. check products availability
2. calculate total or the cart
3. check cupon is available
3.1 if cupon is not available proceed to next step
3.2 if cupon is availbale
  3.2.1 check cupon is ours or not
  3.2.3 check cupon expiry
  if both are ok then go to next step
4. total after cupon apply
5. reduc the stock
5. check the payment method
   5.1 if offline go to next step
   5.2 if online payment gateway
6. cretae a new order in DB
7. delete the user cart from DB
8. send order confirmation mail to user
*/
const CartModel = require("../models/cart.model.js");
const CuponModel = require("../models/cupon.model.js");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const ProductModel = require("../models/products.model.js");
const OrderModel = require("../models/order.model.js");
const Razorpay = require("razorpay");

dayjs.extend(isBetween);

const razorpay = new Razorpay({
  key_id: "YOUR_TEST_KEY_ID",
  key_secret: "YOUR_TEST_SECRET_KEY",
});

// ! Create order
// payload => {method, cupon, address}
const createOrder = async (req, res) => {
  try {
    //0. cart availability
    const cart = await CartModel.findOne({ userId: req.userData._id }).populate(
      "products.productId"
    );
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }
    //1. products availibuity
    const isProductsAvailable = cart.products.every(
      (product) => product.productId.stock >= product.qty
    );
    // console.log(isProductsAvailable);
    if (!isProductsAvailable) {
      res.status(400).json({
        success: false,
        message: "Products are out of stock",
      });
    }
    //2. calculate total
    const total = cart.products.reduce((acc, curr) => {
      return acc + curr.qty * curr.productId.price;
    }, 0);
    // console.log(total);
    // cupon availability
    if (!req.body.cupon) {
      //* goto payment
    }
    const cupon = await CuponModel.findOne({ code: req.body.cupon });
    // cupon validation
    if (!cupon) {
      return res.status(400).json({
        success: false,
        message: "Cupon is not valid",
      });
    }
    // check min order value, expiry
    if (total < cupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value for this cupon is ${cupon.minOrderValue}`,
      });
    }
    const startDate = dayjs(cupon.startDate);
    const endDate = dayjs(cupon.endDate);
    const currentDate = dayjs();
    // console.log(`StartDate: `,startDate); // why this shows dayjs object
    // console.log(`EndDate: ${endDate}`);   // and this does not
    // console.log(`CurrentDate: ${currentdate}`);
    const isCuponDateValid = currentDate.isBetween(startDate, endDate);
    console.log(isCuponDateValid);
    if (!isCuponDateValid) {
      return res.status(400).json({
        success: false,
        message: "Cupon date is not valid",
      });
    }

    // calulate discount
    const discountAmount = (total * cupon.discountPercentage) / 100;
    console.log(discountAmount);
    const effectiveDiscount = Math.min(discountAmount, cupon.maxDixcountValue);
    const finalTotal = total - effectiveDiscount;
    // console.log(total, finalTotal);

    // Reduce stock
    for (product of cart.products) {
      await ProductModel.findByIdAndUpdate(product.productId._id, {
        $inc: {
          stock: -product.qty,
        },
      });
    }

    // payment ONLINE -> PG OFFLINE/COD -> create order
    if (req.body.mode === "ONLINE") {
      const razorpayOrder = await razorpay.orders.create({
        amount: finalTotal * 100, // amount in paisa
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        notes: {
          userId: req.userData._id.toString(),
          cartId: cart._id.toString(),
        },
      });

      return res.status(200).json({
        success: true,
        message: "Redirect to payment gateway",
        orderDetails: {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: "YOUR_TEST_KEY_ID", // send this to frontend for Razorpay checkout
        },
      });
    }

    // console.log(req.userData);
    // create order in DB
    const order = await OrderModel.create({
      userId: req.userData._id,
      products: cart.products,
      cupon: req.body.cupon || "",
      modeOfPayment: req.body.mode,
      orderStatus: "PENDING",
      address: req.body.address || req.userData.address,
    });

    // delete the cart
    await CartModel.findByIdAndDelete(cart._id);

    res.json({
      success: true,
      message: "From order palcement",
      total,
      finalTotal,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error from create order api",
    });
  }
};

//! remove order
const removeOrder = async (req, res)=>{
  // payload => {productID, qty}
  
  const orders = await OrderModel.findOne({ userId: req.userData._id });
   //    0
   if (!orders) {
     return res.status(400).json({
       success: false,
       message: "User don't have any orders",
     });
   }
 
   // 1
   const existingProductIdx = orders.products.findIndex(
     (product) => {
        return product.productId == req.body.productId
     }
   );
 
   //   2
   if (existingProductIdx == -1) {
     return res.status(400).json({
       success: false,
       message: "Product does not exists in order",
     });
   } else {
     // check qty -> compare qty -> perfrom decrement
     const productQty = orders.products[existingProductIdx].qty;
     if (productQty <= req.body.qty) {
       orders.products.splice(existingProductIdx, 1);
     } else {
       orders.products[existingProductIdx].qty -= req.body.qty;
     }
     await orders.save();
     // if no products after removals delete the document
     if(orders.products.length === 0){
        await WishlistModel.findByIdAndDelete(wishlist._id)
     }
   }
   res.json({
     success: true,
     message: "order removed",
   });
 };

//  ! Get all orders
const list = async (req, res)=>{
  try {
    const orders = await OrderModel.findOne({userId: req.userData._id}).populate("products.productId")
  res.json({
    success: true,
    orders
  })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Can not fetch data from order DB",
      error
    })
  }
}


 



const orderControllers = {
  createOrder,
  removeOrder,
  list
};
module.exports = orderControllers;
