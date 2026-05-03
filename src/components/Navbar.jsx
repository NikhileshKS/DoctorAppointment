import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";  

const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setDToken } = useContext(DoctorContext);

    const navigate = useNavigate();  

    const logout = () => {
        // ── Admin logout ──
        if (aToken) {
            localStorage.removeItem("aToken");
            setAToken("");
        }
        // ── Doctor logout ──
        if (dToken) {
            localStorage.removeItem("dToken");
            setDToken("");
        }
        navigate('/');  
    };

    return (
        <div className="w-full bg-white border-b shadow-sm cursor-pointer">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                {/* Left - Logo and Title */}
                <div className="flex items-center gap-3">
                    <svg width="44" height="44" viewBox="120 20 360 460" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11">
                        <defs>
                            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6e8ef0"/>
                                <stop offset="50%" stopColor="#4a6ee0"/>
                                <stop offset="100%" stopColor="#2b4c9e"/>
                            </linearGradient>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                            </filter>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <path d="M300 40 C420 40 500 90 500 200 C500 340 380 420 300 460 C220 420 100 340 100 200 C100 90 180 40 300 40Z"
                                fill="url(#shieldGrad)" stroke="#1e3a6b" strokeWidth="5" filter="url(#shadow)"/>
                        <path d="M300 55 C400 55 470 98 470 200 C470 325 370 398 300 435 C230 398 130 325 130 200 C130 98 200 55 300 55Z"
                                fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                        <g filter="url(#glow)">
                            <rect x="170" y="120" width="70" height="20" fill="white" rx="4"/>
                            <rect x="195" y="95" width="20" height="70" fill="white" rx="4"/>
                        </g>
                        <circle cx="300" cy="210" r="55" fill="#f5d5b5" stroke="#d4a885" strokeWidth="1"/>
                        <circle cx="270" cy="210" r="8" fill="rgba(255,255,255,0.3)"/>
                        <circle cx="330" cy="210" r="8" fill="rgba(255,255,255,0.3)"/>
                        <path d="M245 200 Q280 155 355 200 Q355 170 300 165 Q245 170 245 200Z" fill="#4a2c1a"/>
                        <path d="M270 175 L290 170 L310 170 L330 175" stroke="rgba(255,215,170,0.3)" strokeWidth="3" fill="none"/>
                        <path d="M230 340 Q300 295 370 340 L370 420 L230 420Z" fill="#f8f8f8" stroke="#b0b0b0" strokeWidth="3"/>
                        <path d="M280 340 L300 370 L320 340" fill="none" stroke="#b0b0b0" strokeWidth="2"/>
                        <circle cx="350" cy="370" r="14" fill="#2a8bcf" stroke="#1e5a9e" strokeWidth="2"/>
                        <circle cx="350" cy="370" r="6" fill="#e0e0e0" opacity="0.8"/>
                        <path d="M300 320 C320 320 335 340 350 360" stroke="url(#shieldGrad)" strokeWidth="6" fill="none" strokeLinecap="round"/>
                        <circle cx="345" cy="365" r="2" fill="white"/>
                    </svg>

                    <div className="flex flex-col">
                        <div className="relative overflow-hidden group">
                            <p className="font-bold text-xl leading-tight
                                        bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800
                                        bg-[length:200%_auto] animate-gradient-x
                                        text-transparent bg-clip-text
                                        transform transition-all duration-300
                                        group-hover:scale-105 cursor-default
                                        animate-bounce-slow">
                                MY_DOCTOR
                            </p>
                            <div className="absolute inset-0 -translate-x-full 
                                            group-hover:animate-shimmer
                                            bg-gradient-to-r from-transparent via-white/30 to-transparent
                                            pointer-events-none"></div>
                        </div>
                        
                        {/* ✅ shows correct panel label */}
                        <p className="text-xs font-semibold tracking-widest
                                    text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400
                                    animate-pulse">
                            {aToken ? "✦ ADMIN PANEL ✦" : dToken ? "✦ DOCTOR PANEL ✦" : ""}
                        </p>
                    </div>
                </div>

                {/* Right - Logout Button */}
                <button
                    onClick={logout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 font-medium text-sm tracking-wide">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                    </span>
                </button>

            </div>
        </div>
    );
};

export default Navbar;