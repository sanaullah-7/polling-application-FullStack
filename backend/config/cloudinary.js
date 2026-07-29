import {v2 as cloudinary} from "cloudinary";
import multer from "multer";

//Cloudinary keys

// Is ka kaam Cloudinary ko apni credentials de kar configure karna hota hai.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// to upload an image  or 4 images
// Yeh line file upload ke liye ek middleware ready karti hai jo file ko memory mein le leti hai.
export const upload = multer({storage: multer.memoryStorage() });

// to uplaod image to cloudinary
// Yeh function file ka data le kar Cloudinary par upload karega.
export const uploadToCloudinary = (buffer)=>
       new Promise((resolve , reject )=>{
        // this line create a stream for file upload 
                                              //Stream ka matlab hota hai data ko chunk by chunk bhejna
        const stream = cloudinary.uploader.upload_stream(
            {folder: "polling-app"},//Is ka matlab hai ke upload hone wali images Cloudinary ke polling-app folder mein upload karna hai.
           //Yeh callback ke parameters hain. 
            (err, result)=> (err ? reject(err) : resolve(result.secure_url))//Cloudinary ke result mein uploaded image ka secure URL hota hai
            // Yeh line kehti hai ke agar upload successful hua to image ka secure URL return kar do, warna error return kar do.
        );
       //buffer mean file k raw data
        stream.end(buffer)// // Yeh line actual upload start karti hai.
       });
export default cloudinary;