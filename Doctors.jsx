/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext' 

const Doctor = () => {
  const { speciality } = useParams() 
  const { doctors } = useContext(AppContext) 
  const navigate = useNavigate()
  const [filterDoc, setFilterDoc] = useState([])

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse Through the Doctors Speciality.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} 
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-x-gray-600 rounded transition-all cursor-pointer hover:bg-blue-200 ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>
            General physician
          </p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} 
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-x-gray-600 rounded transition-all cursor-pointer hover:bg-blue-200 ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>
            Gynecologist
          </p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} 
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-x-gray-600 rounded transition-all cursor-pointer hover:bg-blue-200 ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>
            Dermatologist
          </p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} 
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-x-gray-600 rounded transition-all cursor-pointer hover:bg-blue-200 ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>
            Pediatricians
          </p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} 
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-x-gray-600 rounded transition-all cursor-pointer hover:bg-blue-200 ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>
            Neurologist
          </p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} 
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-x-gray-600 rounded transition-all cursor-pointer hover:bg-blue-200 ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>
            Gastroenterologist
          </p>
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-7'>
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-15px] transition-all duration-500"
                key={item.id || index}
              >
                <img className='bg-blue-50' src={item.image} alt={`Doctor ${item.name}`} />
                <div className='p-4'>
                  <div className='flex items-center'>
                    <span className='w-2 h-2 bg-green-600 rounded-full mr-2'></span>
                    <p className='text-green-600 text-sm'>Available</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-800 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p className="text-blue-600">Doctors Not Available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctor
