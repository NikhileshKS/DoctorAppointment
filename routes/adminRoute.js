import express from "express";
import { addDoctor, adminLogin, allDoctors, appointmentsAdmin,AppointmentCancellation ,getDashboardData,resetDoctorPassword} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorControllers.js"; 

const adminRouter = express.Router();

// admin login 
adminRouter.post("/login", adminLogin);

// get all doctors from admin panel
adminRouter.post("/all-doctors",authAdmin, allDoctors);

// change doctor availability
adminRouter.post("/change-availability", authAdmin,changeAvailability);

// get all appointments for admin
adminRouter.post("/appointments", authAdmin, appointmentsAdmin);

// Api AppointmentCancellation
adminRouter.post("/cancel-appointment", authAdmin, AppointmentCancellation);

// get dashboard data
adminRouter.get('/dashboard', authAdmin, getDashboardData);

// reset doctor password
adminRouter.post('/reset-doctor-password', authAdmin, resetDoctorPassword);

// protected route
adminRouter.post(
    "/add-doctor",authAdmin,
    upload.single("image"),
    addDoctor
);

export default adminRouter;
