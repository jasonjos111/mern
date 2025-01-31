import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    avatar: {
      type: String, //Cloudinary url
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video  " }],
    password: {
      type: String,
      required: [true, "password is required"],
      min: [6, "Password should be atleast 6 characters"],
      max: [16, "Password is too long"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//INFO  //Arrow function is not used because arrow function does not have access to this
//INFO pre is a middleware which is called just before 'save'
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//INFO Add custom methods(which has  access to this )-> isPasswordcorrect to the usermodel schema

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessTokens = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.refreshTokens = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_ACCESS_TOKEN,
    {
      expiresIn: process.env.REFRESH_ACCESS_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
