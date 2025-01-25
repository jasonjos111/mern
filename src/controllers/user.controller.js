import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (res, req) => {
  // Steps for registering new user
  // 1. Get all the details from front end
  // 2.  Validation - not empty
  // 3. check if user exists
  // 4. check for uploaded image and avatar
  // 5. upload them to cloudinary
  // 6. create user object
  // 7. Check if user created
  // 8. remove password and refresh token and other critical info from response
  // 9. send res

  const { email, fullname, username, password } = req.body;
  // console.log("request body", req.body);
  if ([email, fullname, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "username or email already exists");
  }
  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  if (
    req.files &&
    Array.isArray(req.files.coverImageLocalPath) &&
    coverImageLocalPath.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const avatarRes = await uploadToCloudinary(avatarLocalPath);
  const coverImageRes = await uploadToCloudinary(coverImageLocalPath);

  if (!avatarRes) {
    throw new ApiError(400, "Avatar is required");
  }
  const user = await User.create({
    fullname,
    avatar: avatarRes.url,
    coverImage: coverImageRes?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
