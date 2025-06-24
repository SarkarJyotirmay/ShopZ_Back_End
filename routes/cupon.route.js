const express = require("express");
const { create, listCupons } = require("../controllers/cupon.controller.js");
const authorizer = require("../middlewares/roleBasedAccessController.middleware.js");

const CuponRouter = express.Router();

CuponRouter.post("/create", authorizer(["SELLER", "ADMIN"]), create);
CuponRouter.get("/list", listCupons);

module.exports = CuponRouter;
