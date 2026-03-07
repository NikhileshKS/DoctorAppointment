/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
    const navigate = useNavigate()
    const {doctors} = useContext(AppContext)
    return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
    <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
    <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors</p>
    <div className='w-full grid grid-cols-auto gap-4 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0, 10).map((item, index) => (
            <div
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={item._id || index}
            >
            <img className='bg-blue-50' src={item.image} alt={`Doctor ${item.name}`} />
            <div className='p-4'>
                <div className='flex items-center'>
                    <span className={`w-2 h-2 rounded-full mr-2 ${item.available ? 'bg-green-600' : 'bg-red-400'}`}></span>
                    <p className={`text-sm ${item.available ? 'text-green-600' : 'text-red-400'}`}>
                        {item.available ? 'Available' : 'Not Available'}
                    </p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-800 text-sm'>{item.specialization}</p>
            </div>
        </div>
        ))}
    </div>
    <button onClick={()=>{navigate('/doctors');scrollTo(0,0)}} className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
        More
    </button>
    </div>
)
}

export default TopDoctors