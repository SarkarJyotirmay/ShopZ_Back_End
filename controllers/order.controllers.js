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
const ProductModel = require("../models/products.model.js")
const OrderModel = require("../models/order.model.js")

dayjs.extend(isBetween);

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
    for(product of cart.products){
     await ProductModel.findByIdAndUpdate(product.productId._id, {
        $inc: {
          stock: -product.qty
        }
      })
    }

    // payment ONLINE -> PG OFFLINE/COD -> create order
    if(req.body.mode === "ONLINE"){
        // go to payment gateway
    }

    // console.log(req.userData);
    // create order in DB
   const order =  await OrderModel.create({
      userId: req.userData._id,
      products: cart.products,
      cupon: req.body.cupon || "",
      modeOfPayment: req.body.mode,
      orderStatus: "PENDING",
      address: req.body.address || req.userData.address,
    })

    // delete the cart
   await CartModel.findByIdAndDelete(cart._id)

    res.json({
      success: true,
      message: "From order palcement",
      total,
      finalTotal,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error from create order api",
    });
  }
};

const orderControllers = {
  createOrder,
};
module.exports = orderControllers;
