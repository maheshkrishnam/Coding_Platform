import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) null;

    // uploading file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    console.log("file has been uploaded successfully");

    return response;
  } catch (error) {
    // if there is some error, remove the locally saved file
    fs.unlinkSync(localFilePath);
  }
};

export default uploadOnCloudinary;