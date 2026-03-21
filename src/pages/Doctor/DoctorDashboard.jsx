import React, { useContext, useEffect, useState } from "react";
import { DoctorContent } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
    const { dToken, backendUrl } = useContext(DoctorContent);
    const [dashData, setDashData] = useState(null);

    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/dashboard`,
                { headers: { dtoken: dToken } }
            );
            if (data.success) {
                setDashData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (dToken) getDashData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dToken]);

    if (!dashData) return <div className="p-5">Loading...</div>;

    return (
        <div className="m-5">
            {/* ── Stats Cards ── */}
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.earning_icon} alt="Earnings" />
                    <div>
                        <p className="text-2xl font-semibold text-gray-700">₹{dashData.totalEarnings}</p>
                        <p className="text-gray-500 text-sm">Earnings</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.appointments_icon} alt="Appointments" />
                    <div>
                        <p className="text-2xl font-semibold text-gray-700">{dashData.totalAppointments}</p>
                        <p className="text-gray-500 text-sm">Appointments</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.patients_icon} alt="Patients" />
                    <div>
                        <p className="text-2xl font-semibold text-gray-700">{dashData.totalPatients}</p>
                        <p className="text-gray-500 text-sm">Patients</p>
                    </div>
                </div>
            </div>

            {/* ── Latest Appointments ── */}
            <div className="bg-white mt-8 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b">
                    <img src={assets.list_icon} alt="" className="w-5" />
                    <p className="font-medium text-gray-700">Latest Appointments</p>
                </div>

                {dashData.latestAppointments.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 border-b last:border-none transition"
                    >
                        <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={item.userData?.image}
                            alt={item.userData?.name}
                        />
                        <div className="flex-1">
                            <p className="font-medium text-gray-700">{item.userData?.name}</p>
                            <p className="text-sm text-gray-500">
                                {item.slotDate?.split('_').map(p => p.padStart(2, '0')).join('-')} | {item.slotTime}
                            </p>
                        </div>
                        {item.cancelled
                            ? <span className="text-red-500 text-xs font-medium">Cancelled</span>
                            : item.isCompleted
                            ? <span className="text-green-600 text-xs font-medium">Completed ✅</span>
                            : <span className="text-yellow-500 text-xs font-medium">Pending</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorDashboard;