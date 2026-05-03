import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark ,faSquareCheck} from "@fortawesome/free-solid-svg-icons";

const AllAppointment = () => {

    const { aToken, appointments, getAllAppointments ,cancelAppointment } = useContext(AdminContext); 

    

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aToken]);

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const diff = Date.now() - new Date(dob).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    const formatDate = (slotDate) => {
        if (!slotDate) return 'N/A';
        const [day, month, year] = slotDate.split('_');
        return `${day.padStart(2,'0')}/${month.padStart(2,'0')}/${year}`;
    };

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="text-xl font-medium mb-3">All Appointments</p>

            <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">

                {/* Header Row */}
                <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-medium">
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Status</p>
                </div>

                {/* Appointment Rows */}
                {appointments.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                        No appointments found.
                    </div>
                ) : (
                    appointments.map((item, index) => (
                        <React.Fragment key={item._id}>
                            {/* Desktop Row */}
                            <div
                                className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b hover:bg-gray-50 transition items-center"
                            >
                                {/* # */}
                                <p className="text-gray-500">{index + 1}</p>

                                {/* Patient */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src={item.userData?.image || 'https://via.placeholder.com/32'}
                                        alt={item.userData?.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <p>{item.userData?.name || 'N/A'}</p>
                                </div>

                                {/* Age */}
                                <p>{calculateAge(item.userData?.dob)}</p>

                                {/* Date & Time */}
                                <p>{formatDate(item.slotDate)} | {item.slotTime}</p>

                                {/* Doctor */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src={item.docData?.image || 'https://via.placeholder.com/32'}
                                        alt={item.docData?.name}
                                        className="w-8 h-8 rounded-full object-cover bg-indigo-50"
                                    />
                                    <p>{item.docData?.name || 'N/A'}</p>
                                </div>

                                {/* Fees */}
                                <p>₹{item.amount}</p>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    {item.cancelled ? (
                                        <p className="text-red-500 text-xs font-medium">Cancelled</p>
                                    ) : item.payment ? (
                                        <FontAwesomeIcon
                                            icon={faSquareCheck}
                                            size="xl"
                                            style={{ color: "rgb(32, 220, 76)" }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faRectangleXmark}
                                            size="xl"
                                            style={{ color: "rgb(203, 75, 61)" }}
                                            className="cursor-pointer hover:scale-110 transition-transform duration-200"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to cancel this appointment?")) {
                                                    cancelAppointment(item._id);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Mobile Card */}
                            <div className="sm:hidden flex flex-col gap-2 p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.userData?.image || 'https://via.placeholder.com/32'}
                                        alt={item.userData?.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{item.userData?.name || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">Age: {calculateAge(item.userData?.dob)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <img
                                        src={item.docData?.image || 'https://via.placeholder.com/32'}
                                        alt={item.docData?.name}
                                        className="w-6 h-6 rounded-full object-cover bg-indigo-50"
                                    />
                                    <span>{item.docData?.name || 'N/A'}</span>
                                </div>
                                <p className="text-sm text-gray-600">{formatDate(item.slotDate)} | {item.slotTime}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">₹{item.amount}</p>
                                    <div>
                                        {item.cancelled ? (
                                            <span className="text-red-500 text-xs font-medium">Cancelled</span>
                                        ) : item.payment ? (
                                            <FontAwesomeIcon icon={faSquareCheck} size="lg" style={{ color: "rgb(32, 220, 76)" }} />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faRectangleXmark}
                                                size="lg"
                                                style={{ color: "rgb(203, 75, 61)" }}
                                                className="cursor-pointer hover:scale-110 transition-transform duration-200"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to cancel this appointment?")) {
                                                        cancelAppointment(item._id);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllAppointment;