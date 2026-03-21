import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const DoctorContent = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || '');

    const value = {
        dToken,
        setDToken,
        backendUrl,
    };

    return (
        <DoctorContent.Provider value={value}>
            {props.children}
        </DoctorContent.Provider>
    );
};

export default DoctorContextProvider;