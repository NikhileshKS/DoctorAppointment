import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        },

    password: {
        type: String,
        required: true,
    },

    image: {
      type: String, // image path or Cloudinary URL
        required: true,
    },

    specialization: {
        type: String,
        required: true,
        trim: true,
    },

    degree: {
        type: String,
        required: true,
        trim: true,
    },

    experience: {
        type: Number,
        required: true,
        min: 0,
    },

    about: {
        type: String,
        required: true,
    },

    available: {
        type: Boolean,
        default: true,
    },

    fees: {
        type: Number,
        required: true,
        min: 0,
    },

    address: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },

    slots_blocked: {
        type: Object,
        default: {},
    },
},
    {
    timestamps: true,
    minimize: false,
    }
);

const Doctor =
    mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;
