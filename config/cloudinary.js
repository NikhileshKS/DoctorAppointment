import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = () => {

    cloudinary.config({
        cloud_name: process.env.ClOUNDARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUNDIARY_SECRET_KEY,
    });
}

export default connectCloudinary;