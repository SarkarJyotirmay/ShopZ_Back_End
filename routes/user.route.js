const express = require("express");

// middlewares
const registrationValidation = require("../middlewares/registrationFormValidation.middleware.js")
const loginFormValidation = require("../middlewares/loginFormValidation.middleware.js")

const {
    register,
    login,
    forgotPassword,
    resetPassword
} = require("../controllers/user.controllers.js");

const router = express.Router();

router.post("/register",registrationValidation, register);

router.post("/login", loginFormValidation, login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;