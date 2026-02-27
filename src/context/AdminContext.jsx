/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || '');

    const value = {
        aToken,
        setAToken,
        backendUrl,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;