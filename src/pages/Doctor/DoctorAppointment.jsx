import React, { useContext, useEffect, useState } from "react";
import { DoctorContent } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const DoctorAppointment = () => {
    const { dToken, backendUrl } = useContext(DoctorContent);
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/appointments`,
                { headers: { dtoken: dToken } }
            );
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`,
                { appointmentId },
                { headers: { dtoken: dToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appointmentId },
                { headers: { dtoken: dToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (dToken) getAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [dToken]);

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="text-xl font-medium mb-3">My Appointments</p>

            <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">

                {/* Header */}
                <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-medium">
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Payment</p>
                    <p>Action</p>
                </div>

                {appointments.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                        No appointments found.
                    </div>
                ) : (
                    appointments.map((item, index) => (
                        <div
                            key={item._id}
                            className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr_1fr] py-3 px-6 border-b hover:bg-gray-50 transition items-center"
                        >
                            {/* # */}
                            <p className="text-gray-500">{index + 1}</p>

                            {/* Patient */}
                            <div className="flex items-center gap-2">
                                <img
                                    src={item.userData?.image}
                                    alt={item.userData?.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <p>{item.userData?.name}</p>
                            </div>

                            {/* Age */}
                            <p>{item.userData?.dob
                                ? Math.floor((Date.now() - new Date(item.userData.dob)) / (1000 * 60 * 60 * 24 * 365.25))
                                : 'N/A'}
                            </p>

                            {/* Date & Time */}
                            <p>{item.slotDate?.split('_').map(p => p.padStart(2,'0')).join('-')} | {item.slotTime}</p>

                            {/* Fees */}
                            <p>₹{item.amount}</p>

                            {/* Payment */}
                            <p className={`text-xs font-medium ${item.payment ? 'text-green-600' : 'text-yellow-500'}`}>
                                {item.payment ? 'Paid' : 'Pending'}
                            </p>

                            {/* Action */}
                            <div className="flex items-center gap-2">
                                {item.cancelled ? (
                                    <p className="text-red-500 text-xs font-medium">Cancelled</p>
                                ) : item.isCompleted ? (
                                    <p className="text-green-600 text-xs font-medium">Completed</p>
                                ) : (
                                    <div className="flex gap-2">
                                        <img
                                            onClick={() => cancelAppointment(item._id)}
                                            src={assets.cancel_icon}
                                            alt="Cancel"
                                            className="w-8 cursor-pointer hover:scale-110 transition"
                                        />
                                        <img
                                            onClick={() => completeAppointment(item._id)}
                                            src={assets.tick_icon}
                                            alt="Complete"
                                            className="w-8 cursor-pointer hover:scale-110 transition"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorAppointment;