import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";

         
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// upload file on cloudinary
const uploadOnCloudinary = async function (localFilePath) {
    try {
        if (!localFilePath) {
            return null
        }
        // upload file on cloudinary
        const resonse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // detect automatically type of file
        })
        fs.unlinkSync(localFilePath)
        // file uploaded
        // console.log("File uploaded Successfully !");
        // console.log(resonse)
        return resonse;
    } catch (error) {
        // remove the locally saved temporary file as the upload failed
        fs.unlinkSync(localFilePath) 
        return null;
    }
}


export { uploadOnCloudinary }