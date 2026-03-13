import { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userData, setUserData] = useState(null);
    const isLoggingOut = useRef(false);

    const saveToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
            setUserData(null);
        }
    };

    const loadUserData = useCallback(async (currentToken) => {
        try {
            const { data } = await axios.get(`${backendURL}/api/user/profile`, {
                headers: { token: currentToken } 
            });
            if (data.success) {
                setUserData(data.user);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                if (!isLoggingOut.current) {
                    isLoggingOut.current = true;
                    saveToken(null);
                    toast.error('Session expired. Please login again.');
                    setTimeout(() => { isLoggingOut.current = false; }, 2000);
                }
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    }, [backendURL]);

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getDoctorsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (token) {
            loadUserData(token);
        }
    }, [token, loadUserData]);

    const logout = () => {
        saveToken(null);
        toast.success('Logged out successfully');
    };

    const value = {
        doctors,
        backendURL,
        getDoctorsData,
        token,
        setToken: saveToken,
        logout,
        userData,
        setUserData,
        loadUserData,
        currencySymbol: '₹',
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContextProvider;