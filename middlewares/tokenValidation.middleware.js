const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const tokenValidation = async (req, res, next) => {
  // check if token present
  // check if token is ours or not (with our secret key)
  // check if token expired or not
if(!req.headers.authorization){
  return res.status(401).json({
    success: false,
    message: "Token is not found",
    from: "token vailidation middleware",
  })
}
  const authToken = req.headers.authorization.split(" ")[1];

  if (!authToken) {
    console.log("Token not recived");

    return res.status(401).json({
      success: false,
      message: "Token is not found",
      from: "token vailidation middleware",
    });
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    // console.log(decoded);
    req.userData = decoded; // for auth api to bypass login afetr page refresh with token data
    next();
  } catch (err) {
    // err
    console.log(`Error in token validation: ${err}`);

    res.status(401).json({
      success: false,
      message: "Token is not verified",
      from: "token validation middleare",
      error: err
    });
  }
};

module.exports = tokenValidation;
