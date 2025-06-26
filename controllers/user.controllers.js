const UserModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

// register => payload => user Schema
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

// login => payload => {email, password}
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
      address: user.address,
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

// payload => {email}
const forgotPassword = async (req, res) => {
  // create OTP -> store OTP in DB -> send mail
  try {
    const otp = Math.floor(Math.random() * 10000);
    const otpExpiry = dayjs().add(5, "minutes").toDate();

    await UserModel.updateOne(
      { email: req.body.email },
      { passwordOTP: otp, passwordOTPExpiry: otpExpiry }
    );
    // sent email with mail dev and node mailer

    res.json({
      succes: true,
      message: "Password reset OTP sent on registered email",
      otp,
      otpExpiry: "5 minutes",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to forgot password",
      from: "forgot password api",
      error,
    });
  }
};

//
const resetPassword = async (req, res) => {
  // payload => {email, otp, newPass}
  //  find user (with email & otp) ->validate the otp (current otp, expiry) -> update password
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
      passwordOTP: req.body.otp,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isOtpMatched = user.passwordOTP == req.body.otp;
    const isOTPValid = dayjs().isBefore(user.passwordOTPExpiry);

    if (!isOtpMatched || !isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "OTP is not valid",
      });
    }

    const newHashedPass = await bcrypt.hash(req.body.newPassword, 10);
    await UserModel.updateOne(
      { email: req.body.email },
      {
        $set: { password: newHashedPass },
      }
    );

    res.json({
      succes: true,
      message: "Successfullt reseted password",
    });
  } catch (error) {}
};

//
const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashPass = await bcrypt.hash(newPassword, 10);
    await UserModel.updateOne(
      { email: req.body.email },
      {
        $set: { password: hashPass },
      }
    );
    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      from: "change password api",
      error,
    });
  }
};

const userController = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};

module.exports = userController;
