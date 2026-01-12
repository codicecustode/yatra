import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const uploadFileToCloudinary = async (filePath: string): Promise<string> => {
  const isPDF = filePath.toLowerCase().endsWith(".pdf");

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "yatra",
    resource_type: isPDF ? "raw" : "auto",
  });

  return result.secure_url;
};

export { uploadFileToCloudinary };
