const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { model, Schema } = mongoose;

const userModel = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "please provide first name"],
      minLength: 3,
      maxLength: 40,
      lowercase: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "please provide last name"],
      minLength: 3,
      maxLength: 40,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "please provide email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "please provide correct email",
      },
    },
    password: {
      type: String,
      minLength: 8,
      required: [true, "please provide password"],
    },
    about: {
      type: String,
    },
    website: {
      type: String,
    },
    github: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    role: {
      type: String,
      required: [true, "please provide a role"],
      enum: ["admin", "user"],
      default: "user",
    },
  },

  { timestamp: true }
);

userModel.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/** compare password  */
userModel.methods.comparePasswords = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

module.exports = model("User", userModel);
