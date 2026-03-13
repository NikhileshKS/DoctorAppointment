import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId:      { type: String, required: true },
    docId:       { type: String, required: true },
    slotDate:    { type: String, required: true },
    slotTime:    { type: String, required: true },
    userDate:    { type: Object, required: true },
    docDate:     { type: Object, required: true },
    amount:      { type: Number, required: true },
    date:        { type: Number, required: true },
    cancelled:   { type: Boolean, default: false },
    payment:     { type: Boolean, default: false }, // ✅ default false, not required
    isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
export default Appointment;