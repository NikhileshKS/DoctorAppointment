import express from "express";
import { addDoctor, adminLogin, allDoctors } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// admin login 
adminRouter.post("/login", adminLogin);

// get all doctors from admin panel
adminRouter.post("/all-doctors",authAdmin, allDoctors);

// protected route
adminRouter.post(
    "/add-doctor",authAdmin,
    upload.single("image"),
    addDoctor
);

export default adminRouter;
