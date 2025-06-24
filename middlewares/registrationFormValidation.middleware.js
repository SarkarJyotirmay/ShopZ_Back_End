const userValidations = require("../validations/userValidations.js");

const {
  isFNameValid,
  isLNameValid,
  isEmailValid,
  isMobileValid,
  isPasswordValid,
} = userValidations;

const isUserRegistrationValid = (req, res, next) => {
  const user = req.body;
  if (
    !isFNameValid(user.firstName) ||
    !isLNameValid(user.lastName) ||
    !isEmailValid(user.email) ||
    !isMobileValid(user.mobNo) ||
    !isPasswordValid(user.password)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials, please enter all valid details",
      from: "registration form validation middleware",
    });
  }
  next();
};

module.exports = isUserRegistrationValid;
