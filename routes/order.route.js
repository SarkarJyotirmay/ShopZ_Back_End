const express = require("express");
const {
  createOrder,
  removeOrder,
  list
} = require("../controllers/order.controllers.js");

// const { createOrder } = orderControllers;

const router = express.Router();

router.post("/create", createOrder);
router.post("/remove", removeOrder);
router.get("/", list);

module.exports = router;
