const express = require("express");

// middlewares
const registrationValidation = require("../middlewares/registrationFormValidation.middleware.js")
const loginFormValidation = require("../middlewares/loginFormValidation.middleware.js")

const {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword
} = require("../controllers/user.controllers.js");

const router = express.Router();

router.post("/register",registrationValidation, register);

router.post("/login", loginFormValidation, login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/change-password", changePassword)

module.exports = router;