const CuponModel = require("../models/cupon.model");
const { options } = require("../routes/user.route");

const create = async (req, res) => {
  const cupon = await CuponModel.create(req.body);
  res.json({
    success: true,
    message: "Cupon created successfully",
    cupon,
  });
};

// route -> /api/v1/cupon/list/?searchKey=<>&pageNo=<>&PageSize=<>
const listCupons = async (req, res) => {
  const { searchKey, pageNo, pageSize } = req.query;

  const toSkip = (pageNo - 1) * pageSize || 0;
  const toShow = pageSize || 5;
  let filter = {}

  if(searchKey){
     filter = {
    code: {
      $regex: searchKey,
      $options: "i",
    },
  };
  }
  const cupons = await CuponModel.find(filter).skip(toSkip).limit(toShow);

  res.json({
    success: true,
    result: cupons
  })
};

const cuponControllers = {
  create,
  listCupons,
};

module.exports = cuponControllers;
