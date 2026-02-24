/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";


export const DoctorContent = createContext();

// provider component
const DoctorContextProvider = (props) => {

    const value = {
        // put global states/functions here
    };

    return (
        <DoctorContent.Provider value={value}>
        {props.children}
        </DoctorContent.Provider>
    );
    };

export default DoctorContextProvider;
