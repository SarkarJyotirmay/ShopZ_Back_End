const UserModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  // Todo:  Write validation for req body
  try {
    // const hashPass = await bcrypt.hash(req.body.password, 10) => to avoid redundancy moved to user model
    await UserModel.create({ ...req.body, user: "CUSTOMER" });
    res.json({
      succes: true,
      message: "Registration successfull",
      user: req.body,
      from: "register API",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      from: "register API",
    });
  }
};
// register => payload => Schema

const login = async (req, res) => {
  // email and pass structure validation is checked in middleware
  // cjheck if user is present in db
  // check if user password matches
  try {
    // console.log(`Login api hit`);
    const user = await UserModel.findOne({ email: req.body.email });
    const plainTextpass = req.body.password;
    // if user not found
    if (!user) {
      console.log(`user not found`);

      return res.status(500).json({
        success: false,
        message: "User not found in DB",
        from: "login API",
      });
    }
    // if password not matched
    let passMatched = await bcrypt.compare(plainTextpass, user.password);
    if (!passMatched) {
      console.log(`pass not matched`);

      return res.status(401).json({
        success: false,
        message: "Wrong password",
        from: "login API",
      });
    }
    // if everything ok
    const tokenData = {
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      message: "Login successful",
      user: tokenData, 
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "login API failed",
      from: "login API",
    });
  }
};
// login => payload => {email, password}

const forgotPassword = async (req, res) => {
  res.json({
    succes: true,
    message: "Dummy forgot password API",
  });
};

const resetPassword = async (req, res) => {
  res.json({
    succes: true,
    message: "Dummy reset password API",
  });
};

const userController = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

module.exports = userController;
