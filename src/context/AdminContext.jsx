/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || '');
    const [appointments, setAppointments] = useState([]);

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/all-doctors",
                {},
                { headers: { atoken: aToken } }
            );
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/change-availability",
                { docId },
                { headers: { atoken: aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            }else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllAppointments = async () => {
        try {
            
            const { data } = await axios.post(
                backendUrl + "/api/admin/appointments",
                {},
                { headers: { atoken: aToken } }
            );
            if (data.success) {
                setAppointments([...data.appointments].sort((a, b) => b.date - a.date));
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const cancelAppointment = async (appointmentId) => {
    try {
        const { data } = await axios.post(
            backendUrl + "/api/admin/cancel-appointment",
            { appointmentId },
            { headers: { atoken: aToken } }
        );
        if (data.success) {
            toast.success(data.message);
            getAllAppointments(); 
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,       
        getAllDoctors,  
        changeAvailability,
        appointments,
        getAllAppointments,
        setAppointments,
        cancelAppointment
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;