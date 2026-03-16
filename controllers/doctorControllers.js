import mongoose from "mongoose";
import doctorModel from "../models/DoctorModel.js";

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

export { changeAvailability, doctorList };