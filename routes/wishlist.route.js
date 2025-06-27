const express = require("express")
const {add, remove, list} = require("../controllers/wishlist.controllers")

const router = express.Router()

router.post("/add", add)
router.post("/remove", remove)
router.get("/list", list)

module.exports = router