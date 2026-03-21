import mongoose from "mongoose";
import doctorModel from "../models/DoctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

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
        console.log("Doctor found:", doctor ? "YES" : "NO");
        console.log("Stored hash:", doctor?.password);

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
        await doctorModel.findByIdAndUpdate(req.docId, { fees, address, available, about });
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

export { 
    changeAvailability, 
    doctorList, 
    doctorLogin,
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorAppointments,
    completeAppointment,
    cancelAppointmentByDoctor,
    getDoctorDashboard
};