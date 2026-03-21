import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const Dashboard = () => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const [dashData, setDashData] = useState(null);

    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/dashboard",
                { headers: { atoken: aToken } }
            );
            if (data.success) {
                setDashData(data.dashboardData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (aToken) getDashData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aToken]);

    if (!dashData) return <div className="p-5">Loading...</div>;

    return (
        <div className="m-5">
            {/* ── Stats Cards ── */}
            <div className="flex flex-wrap gap-4">

                <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.doctor_icon} alt="Doctors" />
                    <div>
                        <p className="text-2xl font-semibold text-gray-700">{dashData.totalDoctors}</p>
                        <p className="text-gray-500 text-sm">Doctors</p>
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
                            className="w-10 h-10 rounded-full object-cover bg-indigo-50"
                            src={item.docData?.image}
                            alt={item.docData?.name}
                        />
                        <div className="flex-1">
                            <p className="font-medium text-gray-700">{item.docData?.name}</p>
                            <p className="text-sm text-gray-500">
                                {item.slotDate?.split('_').map(p => p.padStart(2,'0')).join('-')} | {item.slotTime}
                            </p>
                        </div>
                        {item.cancelled
                            ? <span className="text-red-500 text-xs font-medium">Cancelled</span>
                            : item.payment
                            ? <span className="text-green-600 text-xs font-medium">Paid ✅</span>
                            : <span className="text-yellow-500 text-xs font-medium">Pending</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;