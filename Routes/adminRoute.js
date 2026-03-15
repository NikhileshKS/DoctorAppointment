import express from "express";
import { addDoctor, adminLogin, allDoctors } from "../Controllers/AdminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvaliabity } from "../Controllers/doctorControllers.js"; 

const adminRouter = express.Router();

// admin login 
adminRouter.post("/login", adminLogin);

// get all doctors from admin panel
adminRouter.post("/all-doctors",authAdmin, allDoctors);

// change doctor availability
adminRouter.post("/change-availability", authAdmin,changeAvaliabity);

// protected route
adminRouter.post(
    "/add-doctor",authAdmin,
    upload.single("image"),
    addDoctor
);

export default adminRouter;
