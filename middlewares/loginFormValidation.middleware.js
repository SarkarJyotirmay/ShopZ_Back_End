const userValidations = require("../validations/userValidations.js"); // validator functions

const { isEmailValid, isPasswordValid } = userValidations;

// if email and pass format not valid
async function loginFormValidation(req, res, next) {
  const formData = req.body; //{email, password}
  if(!isEmailValid(formData.email) || !isPasswordValid(formData.password)){
    return res.status(401)({
        success: false,
        message: "Failed to login due to invalid credentials",
        from: "login form validation middleware"
    })
  }
  
  next();
}

module.exports = loginFormValidation
