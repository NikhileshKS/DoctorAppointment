import mongoose from "mongoose";
import doctorModel from "../models/DoctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from "nodemailer";

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        if (!docId || typeof docId !== "string" || !mongoose.Types.ObjectId.isValid(docId)) {
            return res.status(400).json({ success: false, message: "Invalid doctor ID" });
        }
        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        return res.status(200).json({ success: true, message: "Doctor availability changed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to change availability" });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-password", "-email"]);
        return res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "doctorList Error" });
    }
}

const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        const doctor = await doctorModel.findOne({ email: email.toLowerCase().trim() });

        if (!doctor) {
            return res.status(400).json({ success: false, message: "Doctor not found" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { docId: doctor._id },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.status(200).json({ 
            success: true, 
            message: "Doctor logged in successfully", 
            token 
        });

    } catch (error) {
        console.error("Doctor Login Error:", error);
        return res.status(500).json({ success: false, message: "Login failed" });
    }
};

// ── Get Doctor Profile ──
const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.docId).select("-password");
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        return res.status(200).json({ success: true, doctor });
    } catch (error) {
        console.error("Get Doctor Profile Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
};

// ── Update Doctor Profile ──
const updateDoctorProfile = async (req, res) => {
    try {
        const { fees, address, available, about } = req.body;
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
        await doctorModel.findByIdAndUpdate(req.docId, { fees, address: parsedAddress, available, about });
        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update Doctor Profile Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

// ── Get Doctor Appointments ──
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel
            .find({ docId: req.docId })
            .sort({ date: -1 });
        return res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error("Get Doctor Appointments Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch appointments" });
    }
};

// ── Complete Appointment ──
const completeAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.docId.toString() !== req.docId.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
        return res.status(200).json({ success: true, message: "Appointment marked as completed" });

    } catch (error) {
        console.error("Complete Appointment Error:", error);
        return res.status(500).json({ success: false, message: "Failed to complete appointment" });
    }
};

// ── Cancel Appointment by Doctor ──
const cancelAppointmentByDoctor = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.docId.toString() !== req.docId.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // ── free the slot ──
        const doctor = await doctorModel.findById(req.docId);
        let slots_blocked = doctor.slots_blocked || {};
        if (slots_blocked[appointment.slotDate]) {
            slots_blocked[appointment.slotDate] = slots_blocked[appointment.slotDate]
                .filter(t => t !== appointment.slotTime);
        }
        await doctorModel.findByIdAndUpdate(req.docId, { slots_blocked });

        return res.status(200).json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.error("Cancel Appointment Doctor Error:", error);
        return res.status(500).json({ success: false, message: "Failed to cancel appointment" });
    }
};

// ── Doctor Dashboard ──
const getDoctorDashboard = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ docId: req.docId });

        const totalAppointments = appointments.length;
        const totalEarnings = appointments
            .filter(a => a.payment)
            .reduce((sum, a) => sum + a.amount, 0);
        const totalPatients = [...new Set(appointments.map(a => a.userId.toString()))].length;

        const latestAppointments = await appointmentModel
            .find({ docId: req.docId })
            .sort({ date: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            dashboardData: {
                totalAppointments,
                totalEarnings,
                totalPatients,
                latestAppointments
            }
        });

    } catch (error) {
        console.error("Doctor Dashboard Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch dashboard" });
    }
};

// ── Doctor Forgot Password (Self-Service) ──
const forgotDoctorPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const doctor = await doctorModel.findOne({ email: email.toLowerCase().trim() });

        // Security: same response whether doctor exists or not
        if (!doctor) {
            return res.status(200).json({
                success: true,
                message: 'If this email is registered, a reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { docId: doctor._id, purpose: 'doctor-password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const adminUrl = process.env.ADMIN_URL || 'http://localhost:5174';
        const resetLink = `${adminUrl}/reset-password?token=${resetToken}`;

        // Guard: if email env vars are not configured, log the link
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Doctor reset link (email not configured):', resetLink);
            return res.status(200).json({
                success: true,
                message: 'If this email is registered, a reset link has been sent.'
            });
        }

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"MyDoctorAppointment" <${process.env.EMAIL_USER}>`,
            to: doctor.email,
            subject: 'Doctor Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #5f6fff; text-align: center;">MyDoctorAppointment</h2>
                    <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
                    <p>We received a request to reset your password. Click the button below to reset it.</p>
                    <p>This link will expire in <strong>15 minutes</strong>.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}"
                        style="background-color: #5f6fff; color: white; padding: 12px 30px;
                                border-radius: 8px; text-decoration: none; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2026 MyDoctorAppointment. All rights reserved.
                    </p>
                </div>
            `,
        });

        return res.status(200).json({
            success: true,
            message: 'If this email is registered, a reset link has been sent.'
        });

    } catch (error) {
        console.error('Doctor Forgot Password Error:', error);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

// ── Doctor Reset Password (Self-Service) ──
const resetDoctorPasswordSelf = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
        }

        if (decoded.purpose !== 'doctor-password-reset') {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        const doctor = await doctorModel.findById(decoded.docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await doctorModel.findByIdAndUpdate(decoded.docId, { password: hashedPassword });

        return res.status(200).json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        console.error('Doctor Reset Password Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
};

export { 
    changeAvailability, 
    doctorList, 
    doctorLogin,
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorAppointments,
    completeAppointment,
    cancelAppointmentByDoctor,
    getDoctorDashboard,
    forgotDoctorPassword,
    resetDoctorPasswordSelf
};