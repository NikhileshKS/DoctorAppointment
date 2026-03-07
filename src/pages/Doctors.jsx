/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext' 

const Doctor = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext) 
  const [showFilter, setShowFilter] = useState(false) // Fixed variable name

  const navigate = useNavigate()
  const [filterDoc, setFilterDoc] = useState([])

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.specialization === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  // Specialities array to avoid repetition
  const specialities = [
    'General Physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  return (
    <div className='p-4'>
      <p className='text-gray-600'>Browse Through the Doctors Speciality.</p>
      
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        {/* Filter Toggle Button */}
        <button 
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`} 
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>
        
        {/* Filter Sidebar */}
        <div className={`flex-col gap-4 text-sm text-gray-600 w-full sm:w-auto ${
          showFilter ? 'flex' : 'hidden sm:flex'
        }`}>
          {specialities.map((spec) => (
            <p 
              key={spec}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)} 
              className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-blue-200 ${
                speciality === spec ? "bg-indigo-100 text-black font-medium" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-7'>
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300 shadow-md hover:shadow-lg"
                key={item._id || index} // Fixed: use item._id instead of item.id
              >
                <img 
                  className='w-full h-48 object-cover bg-blue-50' 
                  src={item.image} 
                  alt={`Doctor ${item.name}`} 
                />
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <span className={`w-2 h-2 rounded-full mr-2 ${item.available ? 'bg-green-600' : 'bg-red-400'}`}></span>
                    <p className={`text-sm ${item.available ? 'text-green-600' : 'text-red-400'}`}>
                      {item.available ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.specialization}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center col-span-full py-8">
              <p className="text-blue-600 text-lg">Doctors Not Available</p>
              <p className="text-gray-500 mt-2">No doctors found for this speciality</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctor