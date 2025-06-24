const express = require("express")
const {bypassLogin} = require("../controllers/auth.controllers.js")


const AuthRoutetr = express.Router()

AuthRoutetr.get("/bypass/login", bypassLogin)

module.exports = AuthRoutetr