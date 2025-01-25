import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//INFO  Cloudinary onfiguration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//INFO Function to upload file to cloudinary
const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const cloudinaryPath = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("File uploaded to cloudinary at:\n", cloudinaryPath.url);
    fs.unlinkSync(localFilePath);
    return cloudinaryPath;
  } catch (error) {
    //INFO remove the file from the local storage on error
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadToCloudinary };
