import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        address: {
            type: Object,
            default:{line1:'',line2:''},
        },
        gender: {
            type: String,
            default: "Not Specified",
        },
        dob: {
            type: String,
            default: "Not Specified",
        },
        phone: {
            type: String,
            default: '0000000000',
        }
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;