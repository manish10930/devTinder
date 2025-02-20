const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        required: true,
        min: 18,
    },
    gender: {
        type: String,
        required: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Data is not valid")

            }
        }
    },
    dateOfBirth: {
        type: Date,

    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("URL is not valid")
            }
        }
    },
    about: {
        type: String,
        default: "This is default about"
    },
    skills: {
        type: [String],
        maxlength: 3,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user=this;
    const token = await jwt.sign({ _id: user._id }, "DEVTINDER@123", { expiresIn: "1d" });

    return token;

}

userSchema.methods.isPasswordValid = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;