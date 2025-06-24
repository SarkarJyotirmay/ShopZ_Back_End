const express = require("express")
const {listProduct, createProduct, getProduct, removeProduct} =  require("../controllers/products.controllers.js")
const tokenValidation = require("../middlewares/tokenValidation.middleware.js")
const ProductRouter = express.Router()

ProductRouter.get("/list", listProduct)

ProductRouter.post("/create",tokenValidation, createProduct)

ProductRouter.get("/:_id", tokenValidation, getProduct)

ProductRouter.post("/remove", tokenValidation, removeProduct)

module.exports = ProductRouter