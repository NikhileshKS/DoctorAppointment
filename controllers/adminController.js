import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import doctorModel from "../models/DoctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};
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
        const imageUpload = await uploadToCloudinary(req.file.buffer);
        const imageUrl = imageUpload.secure_url;

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

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        let passwordValid = false;
        if (process.env.ADMIN_PASSWORD_HASH) {
            passwordValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        } else if (process.env.ADMIN_PASSWORD) {
            passwordValid = password === process.env.ADMIN_PASSWORD;
        }

        if (!passwordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { sub: process.env.ADMIN_EMAIL, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        return res.json({ success: true, message: "Admin logged in successfully", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Login failed" });
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

// Api to get all appointment list 
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        return res.json({ success: true, message: "Appointments fetched successfully", appointments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "appointmentsAdmin Error" });
    }
};

// api for appointment cancellation
const AppointmentCancellation = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }

        const appointment = await appointmentModel.findById(appointmentId);

        // ✅ check if appointment exists
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointment;
        const doctor = await doctorModel.findById(docId);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        let slots_blocked = doctor.slots_blocked || {};

        if (slots_blocked[slotDate]) {
            slots_blocked[slotDate] = slots_blocked[slotDate].filter(t => t !== slotTime);
        }

        await doctorModel.findByIdAndUpdate(docId, { slots_blocked });

        return res.status(200).json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.error("Cancel Appointment Error:", error);
        return res.status(500).json({ success: false, message: "Failed to cancel appointment" });
    }
};

const getDashboardData = async (req, res) => {
    try {
        // get counts
        const totalDoctors = await doctorModel.countDocuments();
        const totalAppointments = await appointmentModel.countDocuments();
        
        // total unique patients
        const totalPatients = await appointmentModel.distinct('userId');
        
        // latest 5 appointments
        const latestAppointments = await appointmentModel
            .find({})
            .sort({ date: -1 })
            .limit(5);

        const dashboardData = {
            totalDoctors,
            totalAppointments,
            totalPatients: totalPatients.length,
            latestAppointments,
        };

        return res.status(200).json({ success: true, dashboardData });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
};

// API to reset doctor password
const resetDoctorPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: "Email and new password required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const doctor = await doctorModel.findOne({ email: email.toLowerCase().trim() });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await doctorModel.findByIdAndUpdate(doctor._id, { password: hashedPassword });

        return res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ success: false, message: "Failed to reset password" });
    }
};

export { addDoctor, adminLogin ,allDoctors, appointmentsAdmin, AppointmentCancellation, getDashboardData ,resetDoctorPassword};