import { asyncHandler } from "../utils/asyncHandler.js";

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
});

export { registerUser };
