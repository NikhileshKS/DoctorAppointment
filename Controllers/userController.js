// login,register,profile,profile update,Booking Appointment,cancel appointment,display appointment,payment gateway
import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import doctorModel from '../models/DoctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

const ALLOWED_ADDRESS_KEYS = ['line1', 'line2', 'city', 'state', 'pincode', 'country'];

function parseAndSanitizeAddress(addressInput) {
    if (addressInput == null) return undefined;
    const raw = typeof addressInput === 'string' ? addressInput.trim() : String(addressInput);
    if (!raw) return undefined;
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return undefined;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined;
    const sanitized = {};
    for (const key of ALLOWED_ADDRESS_KEYS) {
        if (Object.prototype.hasOwnProperty.call(parsed, key) && typeof parsed[key] === 'string') {
            sanitized[key] = parsed[key];
        }
    }
    return Object.keys(sanitized).length ? sanitized : undefined;
}

// API for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({success: false, message: 'Missing Details' });
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: 'Invalid Email Enter the valid email' });
        }
        if(password.length < 8){
            return res.status(400).json({success: false, message: 'Password must be at least 8 characters long' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };
        
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ success: true, message: 'User registered successfully', token });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ success: true, message: 'Login successful', token });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
};

// API to update user profile data
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: 'Missing required details' });
        }

        const sanitizedAddress = parseAndSanitizeAddress(address);

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            ...(sanitizedAddress !== undefined && { address: sanitizedAddress }),
            dob,
            gender
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            });
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        return res.status(200).json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

// API for booking appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        if (!docId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: "Doctor, date and time are required" });
        }
        if (!mongoose.Types.ObjectId.isValid(docId)) {
            return res.status(400).json({ success: false, message: "Invalid doctor ID" });
        }

        const docInfo = await doctorModel.findById(docId).select('-password');

        if (!docInfo) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        if (!docInfo.available) {
            return res.status(400).json({ success: false, message: "Doctor is not available" });
        }

        let slots_booked = docInfo.slots_blocked || {};

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.status(400).json({ success: false, message: "Slot already booked. Please choose another." });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');

        const docData = docInfo.toObject();
        delete docData.slots_blocked;

        const appointmentData = {
            userId,
            docId,
            userData,      
            docData,       
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now(),
            payment: false,
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_blocked: slots_booked });

        return res.status(201).json({ success: true, message: "Appointment booked successfully" });

    } catch (error) {
        console.error("Book Appointment Error:", error);
        return res.status(500).json({ success: false, message: "Failed to book appointment" });
    }
};

// ✅ Display Appointments
const listAppointment = async (req, res) => {
    try {
        const appointments = await appointmentModel
            .find({ userId: req.userId })
            .sort({ date: -1 });
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
    }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;

        if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (!appointment.userId || appointment.userId.toString() !== userId.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
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

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment , cancelAppointment};