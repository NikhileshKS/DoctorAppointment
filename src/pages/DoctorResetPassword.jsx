import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const DoctorResetPassword = () => {
    const { backendUrl } = useContext(DoctorContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/reset-password`, {
                token,
                newPassword,
            });

            if (data.success) {
                setDone(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Invalid or missing token
    if (!token) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center border">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="text-red-500 font-medium">Invalid or missing reset link.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-700">Reset Password</h2>
                    <p className="text-sm text-gray-500 mt-2">Enter your new password below.</p>
                </div>

                {done ? (
                    /* ── Success State ── */
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-green-600 font-medium">Password reset successfully!</p>
                        <p className="text-sm text-gray-500">You can now login with your new password.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    /* ── Form ── */
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="Min. 8 characters"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                    placeholder="Re-enter new password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting...
                                </span>
                            ) : (
                                "Reset Password"
                            )}
                        </button>

                        <p
                            onClick={() => navigate("/")}
                            className="text-center text-sm text-blue-600 cursor-pointer hover:underline"
                        >
                            ← Back to Login
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DoctorResetPassword;
