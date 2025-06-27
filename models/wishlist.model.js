const mongoose = require("mongoose")

const productShape = {
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "products",
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 1
    }
} 

const wishlistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },
    products: {
        type: [productShape],
        required: true
    },
}, {timestamps: true})

const WishlistModel = mongoose.model("wishlists", wishlistSchema)

module.exports = WishlistModel
