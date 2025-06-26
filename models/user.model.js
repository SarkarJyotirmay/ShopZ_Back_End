const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "CUSTOMER",
        enum: ["CUSTOMER", "SELLER", "ADMIN"]
    },
    address: {
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String,
            required: false,
            default: ""
        },
        landmark: {
            type: String,
            required: false,
            default: ""
        },
        city: {
            type: String,
            requried: true
        },
        state: {
            type: String,
            requried: true
        },
        pincode: {
            type: String,
            requried: true
        },
    },
    passwordOTP: {
        // used for reset password
        type: String,
        required: false,
        default: ""
    },
    passwordOTPExpiry: {
        type: Date,
        required: false,
        default: new Date()
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function(){
    const plainTextPass = this.password
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(plainTextPass, salt)
    this.password = hashPass
})

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;