const express = require("express");
const { createOrder } = require("../controllers/order.controllers.js");

// const { createOrder } = orderControllers;

const router = express.Router();

router.post("/create", createOrder);

module.exports = router;
