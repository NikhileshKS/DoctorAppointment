import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import doctorModel from "../models/DoctorModel.js";

// API to Add Doctor
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            specialization,
            degree,
            experience,
            about,
            fees,
            address,
        } = req.body;

        const imageFile = req.file;

        // 1️⃣ Basic validation
        if (!name || !email || !password || !specialization || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image not received" });
        }

        // 2️⃣ Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        // 3️⃣ Check duplicate email
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({ success: false, message: "Doctor already exists with this email" });
        }

        // 4️⃣ Password validation
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // 5️⃣ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 6️⃣ Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });

        // 7️⃣ Create doctor object
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            specialization,
            degree,
            experience,
            about,
            fees,
            address,
            image: imageUpload.secure_url,
            date: Date.now()
        };

        // 8️⃣ Save to DB
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        // 9️⃣ Final response
        return res.status(200).json({ success: true, message: "Doctor added successfully" });

    } catch (error) {
        console.error("Add Doctor Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// API For Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            return res.json({ success: true, message: "Admin logged in successfully", token });
        }

        return res.status(401).json({ success: false, message: "Invalid credentials" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "adminLogin Error" });
    }
};

// Api to get all doctors list for admin
const allDoctors = async (req, res) => {

    try {
        const doctors = await doctorModel.find({}).select("-password");
        return res.json({ success: true, message: "Doctors fetched successfully", doctors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "allDoctors Error" });
    }
}
export { addDoctor, adminLogin ,allDoctors};