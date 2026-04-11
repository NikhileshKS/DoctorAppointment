// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    
    const { doctors, currencySymbol, token, backendURL, getDoctorsData } = useContext(AppContext);
    const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docAddress, setDocAddress] = useState({ line1: '', line2: '' });
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchDocInfo = () => {
        if (doctors && doctors.length > 0) {
            const doc = doctors.find(doc => doc._id === docId);
            if (doc) {
                setDocInfo(doc);
                try {
                    const addr = typeof doc.address === 'string'
                        ? JSON.parse(doc.address)
                        : doc.address || { line1: '', line2: '' };
                    setDocAddress(addr);
                // eslint-disable-next-line no-unused-vars
                } catch (_) {
                    setDocAddress({ line1: doc.address || '', line2: '' });
                }
            }
        }
    };

    const getAvailableSlots = () => {
        const slots = [];
        const today = new Date();

        const bookedSlots = docInfo.slots_blocked || {};

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today.getTime());
            currentDate.setDate(today.getDate() + i);

            const endTime = new Date(today.getTime());
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            const timeSlot = [];

            while (currentDate < endTime) {
                const formattedTime = currentDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
                const isBooked = bookedSlots[slotDate]?.includes(formattedTime);

                if (!isBooked) {
                    timeSlot.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                    });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            slots.push(timeSlot);
        }
        setDocSlots(slots);
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Please login to book an appointment');
            navigate('/login');
            return;
        }
        if (!slotTime) {
            toast.warning('Please select a time slot');
            return;
        }

        try {
            const date = docSlots[slotIndex][0].datetime;
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

            const { data } = await axios.post(
                `${backendURL}/api/user/book-appointment`,
                { docId, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await getDoctorsData(); 
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchDocInfo(); }, [doctors, docId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (docInfo) getAvailableSlots(); }, [docInfo]);

    if (!docInfo) return <div>Loading...</div>;

    return (
        <div>
            {/* Doctor Details */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
                </div>
                <div className="flex-1 border border-gray-800 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {docInfo.name}
                        <img src={assets.verified_icon} alt="" />
                    </p>
                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{docInfo.degree} - {docInfo.specialization}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience} Years</button>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                            About <img src={assets.info_icon} alt="" />
                        </p>
                        <p className="text-sm text-gray-600 max-w-[700px] mt-1">{docInfo.about}</p>
                    </div>
                    <p className="text-gray-800 font-medium mt-2">
                        Appointment fee: <span className="text-gray-600 text-sm">{currencySymbol}{docInfo.fees}</span>
                    </p>
                    <div className="mt-4">
                        <p className="text-gray-800 font-medium">Address: <span className="text-gray-600 text-sm">{docAddress.line1}</span></p>
                        {docAddress.line2 && <p className="text-gray-700 text-sm mt-1">{docAddress.line2}</p>}
                    </div>
                </div>
            </div>

            {/* Booking Slots */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking slots</p>

                {/* Day selector */}
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots?.map((item, index) => (
                        item[0] && (
                            <div
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-600'}`}
                                key={index}
                                onClick={() => { setSlotIndex(index); setSlotTime(''); }}
                            >
                                <p>{daysofWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0].datetime.getDate()}</p>
                            </div>
                        )
                    ))}
                </div>

                {/* Time slots */}
                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots[slotIndex]?.length > 0
                        ? docSlots[slotIndex].map((item, index) => (
                            <p
                                onClick={() => setSlotTime(item.time)}
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-800'}`}
                                key={index}
                            >
                                {item.time.toLowerCase()}
                            </p>
                        ))
                        : <p className="text-sm text-red-400">No slots available for this day</p>
                    }
                </div>

                <div>
                    <button
                        onClick={bookAppointment}
                        className="group relative bg-primary text-white w-56 h-12 border border-[#3654ff] rounded-lg text-center hover:bg-blue-900 cursor-pointer mt-8"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 absolute left-2 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                        <div className="ml-8">Book an Appointment</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Appointment;