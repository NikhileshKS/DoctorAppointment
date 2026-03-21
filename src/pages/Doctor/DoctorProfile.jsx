import React, { useContext, useEffect, useState } from "react";
import { DoctorContent } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
    const { dToken, backendUrl } = useContext(DoctorContent);
    const [doctor, setDoctor] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [available, setAvailable] = useState(false);

    const getProfile = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/profile`,
                { headers: { dtoken: dToken } }
            );
            if (data.success) {
                setDoctor(data.doctor);
                setFees(data.doctor.fees);
                setAbout(data.doctor.about);
                setAvailable(data.doctor.available);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateProfile = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/update-profile`,
                { fees, about, available },
                { headers: { dtoken: dToken } }
            );
            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfile();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (dToken) getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dToken]);

    if (!doctor) return <div className="p-5">Loading...</div>;

    return (
        <div className="m-5">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Doctor Image */}
                <div>
                    <img
                        className="bg-primary/10 w-full sm:max-w-64 rounded-lg object-cover"
                        src={doctor.image}
                        alt={doctor.name}
                    />
                </div>

                {/* Doctor Info */}
                <div className="flex-1 border border-gray-100 rounded-lg p-8 bg-white shadow-sm">
                    <p className="text-2xl font-semibold text-gray-800">{doctor.name}</p>

                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{doctor.degree} - {doctor.specialization}</p>
                        <span className="py-0.5 px-2 border text-xs rounded-full">{doctor.experience} Years</span>
                    </div>

                    {/* About */}
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">About</p>
                        {isEdit ? (
                            <textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                rows={4}
                                className="w-full border rounded p-2 text-sm outline-none focus:border-blue-400"
                            />
                        ) : (
                            <p className="text-sm text-gray-600">{doctor.about}</p>
                        )}
                    </div>

                    {/* Fees */}
                    <div className="mt-4 flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-700">Appointment Fee:</p>
                        {isEdit ? (
                            <input
                                type="number"
                                value={fees}
                                onChange={(e) => setFees(e.target.value)}
                                className="border rounded p-1 text-sm outline-none focus:border-blue-400 w-24"
                            />
                        ) : (
                            <p className="text-sm text-gray-600">₹{doctor.fees}</p>
                        )}
                    </div>

                    {/* Availability */}
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={available}
                            onChange={() => isEdit && setAvailable(prev => !prev)}
                            className="w-4 h-4 accent-indigo-500"
                        />
                        <p className="text-sm text-gray-700">Available for appointments</p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6">
                        {isEdit ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={updateProfile}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEdit(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEdit(true)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;