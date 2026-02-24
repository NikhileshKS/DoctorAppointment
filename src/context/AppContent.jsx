/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";


export const AppContent = createContext();

// provider component
const AppContextProvider = (props) => {

    const value = {
        // put global states/functions here
    };

    return (
        <AppContent.Provider value={value}>
        {props.children}
        </AppContent.Provider>
    );
    };

export default AppContextProvider;
