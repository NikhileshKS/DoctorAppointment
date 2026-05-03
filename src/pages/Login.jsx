import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [state, setState] = useState("Admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { setAToken, backendUrl } = useContext(AdminContext);
    const { setDToken } = useContext(DoctorContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === "Admin") {
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
                    email,
                    password
                });

                if (data.success) {
                    localStorage.setItem("aToken", data.token);
                    setAToken(data.token);
                    toast.success("Login successful!");
                } else {
                    toast.error(data.message);
                }
            } else if (state === "Doctor") {
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
                    email,
                    password
                });

                if (data.success) {
                    localStorage.setItem("dToken", data.token);
                    setDToken(data.token);
                    toast.success("Doctor login successful!");
                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">

                <p className="text-2xl font-semibold m-auto">
                    <span className="text-blue-600">{state}</span> Login
                </p>

                <div className="w-full">
                    <p>Email</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded w-full p-2 mt-1 outline-none"
                        required
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded w-full p-2 mt-1 outline-none pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md transition-colors">
                    Login
                </button>

                {state === "Doctor" && (
                    <p
                        onClick={() => navigate("/forgot-password")}
                        className="text-center text-sm text-blue-500 cursor-pointer hover:underline"
                    >
                        Forgot Password?
                    </p>
                )}

                {
                    state === "Admin"
                        ? <p>Doctor Login? <span className="text-blue-500 underline cursor-pointer" onClick={() => setState("Doctor")}>Click here</span></p>
                        : <p>Admin Login? <span className="text-blue-500 underline cursor-pointer" onClick={() => setState("Admin")}>Click here</span></p>
                }

            </div>
        </form>
    );
};

export default Login;