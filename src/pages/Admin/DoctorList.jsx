import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
    const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

    useEffect(() => {
        console.log("aToken:", aToken);
        if (aToken) {
            getAllDoctors();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aToken]);

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">
            <h1 className="text-lg font-medium">All Doctors</h1>

            <div className="w-full flex flex-wrap gap-4 pt-5">
                {doctors?.map((item, index) => (
                    <div key={index} className="group border border-indigo-200 rounded-xl w-[calc(20%-16px)] min-w-[180px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400">
                        <img
                            className="w-full h-48 object-cover bg-indigo-50  group-hover:bg-blue-500 transition-all duration-300"
                            src={item.image}
                            alt={item.name}
                        />

                        <div className="p-4">
                            <p className="text-neutral-800 text-lg font-medium mb-1 truncate">
                                {item.name}
                            </p>
                            <p className="text-sm text-indigo-500 font-medium mb-2 truncate">
                                {item.speciality}
                            </p>

                            <div className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={item.available}
                                    onChange={() => changeAvailability(item._id)}
                                    className="w-4 h-4 accent-indigo-300"
                                />
                                <p className={item.available ? "text-green-600" : "text-red-500"}>
                                    {item.available ? "Available" : "Not Available"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorList;