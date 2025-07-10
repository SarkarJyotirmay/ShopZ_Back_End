const express = require("express");
const {
  createOrder,
  removeOrder,
  list,
  verifyPayment
} = require("../controllers/order.controllers.js");

const router = express.Router();

router.post("/create", createOrder);
router.post("/verify", verifyPayment); 
router.post("/remove", removeOrder);
router.get("/", list);

module.exports = router;
