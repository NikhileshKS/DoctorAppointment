// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
    const { backendURL, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [formType, setFormType] = useState("login");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ── Input handlers ──
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // ── Validation ──
    const validateLogin = () => {
        const newErrors = {};
        if (!loginData.email.trim())
            newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email))
            newErrors.email = "Invalid email format";
        if (!loginData.password)
            newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSignup = () => {
        const newErrors = {};
        if (!signupData.username.trim())
            newErrors.username = "Full name is required";
        if (!signupData.email.trim())
            newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email))
            newErrors.email = "Invalid email format";
        if (!signupData.password)
            newErrors.password = "Password is required";
        else if (signupData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── LOGIN submit ──
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        setLoading(true);
        try {
            const { data } = await axios.post(`${backendURL}/api/user/login`, {
                email: loginData.email,
                password: loginData.password,
            });

            if (data.success) {
                setToken(data.token);
                toast.success(data.message || "Login successful!");
                navigate("/");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // ── SIGNUP submit ──
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (!validateSignup()) return;

        setLoading(true);
        try {
            const { data } = await axios.post(`${backendURL}/api/user/register`, {
                name: signupData.username,   // ✅ maps "username" → "name" for backend
                email: signupData.email,
                password: signupData.password,
            });

            if (data.success) {
                setToken(data.token);
                toast.success(data.message || "Registration successful!");
                navigate("/");
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // ── Toggle between login and signup ──
    const [exitDirection, setExitDirection] = useState("login");

    const toggleFormType = (type) => {
        setExitDirection(formType);   
        setErrors({});
        setFormType(type);
        if (type === "login") {
            setSignupData({ username: "", email: "", password: "" });
        } else {
            setLoginData({ email: "", password: "" });
        }
    };

    const animationProps = {
        initial: { opacity: 0, x: exitDirection === "login" ? 50 : -50, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit:    { opacity: 0, x: exitDirection === "login" ? -50 : 50, scale: 0.95 },
        transition: { duration: 0.4, ease: "easeInOut" },
    };

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl flex flex-col lg:flex-row overflow-hidden relative">

                {/* ── Form Section ── */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 overflow-hidden">
                    <div className="w-full max-w-xs relative">
                        <AnimatePresence mode="wait">

                            {/* ── LOGIN FORM ── */}
                            {formType === "login" ? (
                                <motion.form
                                    key="login"
                                    onSubmit={handleLoginSubmit}
                                    className="space-y-6 text-center"
                                    {...animationProps}
                                >
                                    <h1 className="text-3xl font-bold text-gray-700">Login</h1>

                                    {/* Email */}
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={loginData.email}
                                            onChange={handleLoginChange}
                                            className={`w-full py-2 pl-4 pr-10 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.email ? "border border-red-500" : ""}`}
                                        />
                                        <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs text-left mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            className={`w-full py-2 pl-4 pr-10 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.password ? "border border-red-500" : ""}`}
                                        />
                                        <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        {errors.password && (
                                            <p className="text-red-500 text-xs text-left mt-1">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Forgot Password */}
                                    <p
                                        className="text-sm text-blue-500 text-right cursor-pointer hover:underline"
                                        onClick={() => navigate('/forgot-password')}
                                    >
                                        Forgot Password?
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </button>
                                </motion.form>

                            ) : (
                                /* ── SIGNUP FORM ── */
                                <motion.form
                                    key="signup"
                                    onSubmit={handleSignupSubmit}
                                    className="space-y-6 text-center"
                                    {...animationProps}
                                >
                                    <h1 className="text-3xl font-bold text-gray-700">Register</h1>

                                    {/* Full Name */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Full Name"
                                            value={signupData.username}
                                            onChange={handleSignupChange}
                                            className={`w-full py-2 pl-4 pr-10 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all ${errors.username ? "border border-red-500" : ""}`}
                                        />
                                        <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        {errors.username && (
                                            <p className="text-red-500 text-xs text-left mt-1">{errors.username}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={signupData.email}
                                            onChange={handleSignupChange}
                                            className={`w-full py-2 pl-4 pr-10 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all ${errors.email ? "border border-red-500" : ""}`}
                                        />
                                        <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs text-left mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={signupData.password}
                                            onChange={handleSignupChange}
                                            className={`w-full py-2 pl-4 pr-10 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all ${errors.password ? "border border-red-500" : ""}`}
                                        />
                                        <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        {errors.password && (
                                            <p className="text-red-500 text-xs text-left mt-1">{errors.password}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Side Panel ── */}
                <motion.div
                    className={`w-full lg:w-1/2 flex flex-col justify-center items-center text-white p-10 transition-colors duration-500 ${formType === "login" ? "bg-blue-500" : "bg-[#9526a9]"}`}
                    key={formType}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {formType === "login" ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4 text-center">New here?</h2>
                            <p className="text-sm mb-6 text-center">Sign up and join our community!</p>
                            <button
                                onClick={() => toggleFormType("signup")}
                                className="px-6 py-2 border border-white rounded-md hover:bg-white hover:text-blue-500 transition-colors"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-4 text-center">Welcome back!</h2>
                            <p className="text-sm mb-6 text-center">Already have an account?</p>
                            <button
                                onClick={() => toggleFormType("login")}
                                className="px-6 py-2 border border-white rounded-md hover:bg-white hover:text-[#9526a9] transition-colors"
                            >
                                Login
                            </button>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default LoginSignup;