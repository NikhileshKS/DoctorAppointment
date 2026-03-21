import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContent } from "../context/DoctorContext";

import Dashboard from "../assets/Dashboard.png";
import Appointment from "../assets/re-appointment.png";
import AddDoctor from "../assets/add.png";
import DoctorList from "../assets/checklist.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";

const adminNavItems = [
    { to: "/admin-dashboard",  icon: Dashboard,   label: "Dashboard" },
    { to: "/all-appointments", icon: Appointment, label: "All Appointments" },
    { to: "/add-doctors",      icon: AddDoctor,   label: "Add Doctor" },
    { to: "/doctor-list",      icon: DoctorList,  label: "Doctor List" },
];

const doctorNavItems = [
    { to: "/doctor-dashboard",    icon: Dashboard,   label: "Dashboard" },
    { to: "/doctor-appointments", icon: Appointment, label: "Appointments" },
    { to: "/doctor-profile",      icon: DoctorList,  label: "My Profile" },
];

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContent);
    const [isOpen, setIsOpen] = useState(true);

    // ── hide sidebar if not logged in ──
    if (!aToken && !dToken) return null;

    // ── pick nav items based on role ──
    const navItems = aToken ? adminNavItems : doctorNavItems;

    return (
        <div
            className={`relative min-h-screen bg-white border-r transition-all duration-300 ${
                isOpen ? "w-52" : "w-16"
            }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-6 z-10 w-7 h-7 flex items-center justify-center
                        bg-white border border-gray-800 rounded-full shadow-sm
                        text-gray-600 hover:text-blue-500 hover:border-blue-500
                        cursor-pointer select-none transition-all duration-300 ease-in-out
                        hover:scale-110 hover:shadow-md active:scale-95"
            >
                <FontAwesomeIcon
                    icon={faCircleChevronRight}
                    className={`transition-transform duration-500 ease-in-out ${
                        isOpen ? "rotate-180" : "rotate-0"
                    }`}
                />
            </button>

            {/* Nav Items */}
            <ul className="mt-5 text-[#515151]">
                {navItems.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                                isActive
                                    ? "bg-gray-100 border-r-4 border-blue-500 font-semibold"
                                    : ""
                            }`
                        }
                    >
                        <img src={icon} alt={label} className="w-5 h-5 flex-shrink-0" />
                        <li
                            className={`list-none text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                            }`}
                        >
                            {label}
                        </li>
                    </NavLink>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;