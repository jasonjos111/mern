import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

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

const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessTokens();
  const refreshToken = user.refreshTokens();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { refreshToken, accessToken };
};

const loginUser = asyncHandler(async (req, res) => {
  // 1. Get the username/email and password and  from frontend
  // 2. Validate username and password --> Authentication
  // 3. Create access token and refresh token if doesn't already created
  // 4. Create cookies
  // console.log(req);
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "Email or Username is required");
  }
  const userSearch = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!userSearch) {
    throw new ApiError(404, "User does not exist");
  }
  const passwordValidate = await userSearch.isPasswordCorrect(password);

  if (!passwordValidate) {
    throw new ApiError(401, "Incorrect username or password");
  }
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(
    userSearch._id
  );
  const loggedInUser = await User.findById(userSearch._id).select(
    "-password -refreshToken "
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user: loggedInUser },
        "User login successful"
      )
    );
});

// const testFunc = asyncHandler(async (req, res) => {
//   console.log("Request body", req.body);
// });

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.accessToken || req.body.accessToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unaauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_ACCESS_TOKEN
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired, Please Login again");
    }
    const { newAccessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(
      used._id
    );
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { newAccessToken, newRefreshToken },
          "Access token generated"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logOutUser, refreshAccessToken };
