const ProductModel = require("../models/products.model.js");
const UserModel = require("../models/user.model.js");

// ! create a product
const createProduct = async (req, res) => {
  // ToDo: validation of body
  try {
    const product = await ProductModel.create(req.body);
    res.json({
      success: true,
      message: `Product created successfully with id ${product._id}`,
      product: product,
    });
  } catch (error) {
    console.log(`Error in creating product, ${error}`);

    res.status(400).json({
      success: false,
      message: `Error in creating/adding product`,
      from: "create product api",
      error: error,
    });
  }
};

// ! Get list of products
// filter based on query by name, desc, category, brand, min-max price,
// api/v1/products/list/searchKey=abc&minPrice=123&maxPrice=234
const listProduct = async (req, res) => {
  try {
    const {
      searchKey = "",
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      minRating = 0,
      pageNo = 1,
      pageSize = 5,
    } = req.query;

    const itemsToSkip = (pageNo - 1) * pageSize;
    const itemsToShow = pageSize;
    const filter = {};

    if (Object.keys(req.query).length > 0) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: searchKey, $options: "i" } },
            { description: { $regex: searchKey, $options: "i" } },
            { brand: { $regex: searchKey, $options: "i" } },
            { category: { $regex: searchKey, $options: "i" } },
          ],
        },
        {
          price: {
            $gte: Number(minPrice),
            $lte: Number(maxPrice),
          },
        },
        {
          rating: {
            $gte: Number(minRating),
          },
        },
      ];
    }

    // ✅ Single find call, works whether filter is empty or not
    const products = await ProductModel.find(filter)
      .skip(itemsToSkip)
      .limit(itemsToShow);
    const totalProductCount = await ProductModel.find(filter).countDocuments();

    res.json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalProductCount,
    });
  } catch (error) {
    console.error("Error in getting product list:", error);
    res.status(400).json({
      success: false,
      message: "Could not get list of products from DB",
      error: error.message,
    });
  }
};

// ! Get a single product
const getProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await ProductModel.findById(_id);
    res.json({
      success: true,
      message: `Product created successfully with id: ${_id}`,
      product: product,
    });
  } catch (error) {
    console.log(`Error in get a single product api: ${error}`);
    res.status(400).json({
      success: false,
      message: `Error in getting single product from DB`,
      from: `Get a single product api`,
      error: error,
    });
  }
};

// delte a product => payload => {_id}
const removeProduct = async (req, res) => {
  const { _id } = req.body;
  const deletedProduct = await ProductModel.findByIdAndDelete(_id);
  res.json({
    success: true,
    message: `Product deleted with id: ${_id}`,
    deletedProduct,
  });
};

const productControllers = {
  listProduct,
  createProduct,
  getProduct,
  removeProduct,
};

module.exports = productControllers;
