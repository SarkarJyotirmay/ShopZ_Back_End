const express = require("express");
const { create, listCupons, remove } = require("../controllers/cupon.controller.js");
const authorizer = require("../middlewares/roleBasedAccessController.middleware.js");

const CuponRouter = express.Router();

CuponRouter.post("/create", authorizer(["SELLER", "ADMIN"]), create);
CuponRouter.get("/list", listCupons);
// CuponRouter.post("/remove", remove)

module.exports = CuponRouter;
