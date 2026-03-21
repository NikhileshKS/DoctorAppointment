import express from "express";
import {
    changeAvailability,
    doctorList,
    doctorLogin,
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorAppointments,
    completeAppointment,
    cancelAppointmentByDoctor,
    getDoctorDashboard
} from "../controllers/doctorControllers.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

// ── Public ──
doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", doctorLogin);
doctorRouter.post("/change-availability", changeAvailability);

// ── Protected ──
doctorRouter.get("/dashboard", authDoctor, getDoctorDashboard);
doctorRouter.get("/profile", authDoctor, getDoctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.get("/appointments", authDoctor, getDoctorAppointments);
doctorRouter.post("/complete-appointment", authDoctor, completeAppointment);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointmentByDoctor);

export default doctorRouter;