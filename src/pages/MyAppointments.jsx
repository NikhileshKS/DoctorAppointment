// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { backendURL, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Fetch appointments from backend ──────────────────────────────────
  const fetchAppointments = async () => {
    if (!token) return
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendURL}/api/user/appointments`, {
        headers: { token },  
      })
      if (data.success) {
        setAppointments(data.appointments.reverse().filter(a => a.docData)) 
      } else {
        console.error('API error:', data.message)
        toast.error(data.message || 'Failed to load appointments')
      }
    } catch (error) {
      console.error('Fetch error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // ── Cancel appointment ────────────────────────────────────────────────
  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Appointment cancelled successfully')
        fetchAppointments()
      } else {
        toast.error(data.message || 'Failed to cancel appointment')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong while cancelling')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="px-4 sm:px-8 mt-12 text-center text-gray-500">
        Please log in to view your appointments.
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-8">
      <p className="pb-3 mt-12 font-medium text-gray-700 border-b text-lg">
        My Appointments
      </p>

      {loading ? (
        <div className="py-10 text-center text-gray-400 animate-pulse">
          Loading appointments…
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          You have no appointments yet.
        </div>
      ) : (
        <div>
          {appointments.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_2fr] sm:flex sm:gap-6 gap-4 py-4 border-b items-center bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Doctor Image */}
              <div>
                <img
                  className="w-32 h-32 object-cover rounded-md bg-indigo-50"
                  src={item.docData.image}
                  alt={`Dr. ${item.docData.name}`}
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 space-y-1">
                <p className="text-indigo-700 font-semibold text-lg">
                  {item.docData.name}
                </p>
                <p className="text-gray-600">{item.docData.specialization}</p>

                {(() => {
                    const addr = typeof item.docData.address === 'string'
                      ? JSON.parse(item.docData.address)
                      : item.docData.address || {}
                    return (addr.line1 || addr.line2) ? (
                      <>
                        <p className="text-sm text-gray-700 font-semibold">Address:</p>
                        {addr.line1 && <p className="text-sm text-gray-700">{addr.line1}</p>}
                        {addr.line2 && <p className="text-sm text-gray-700">{addr.line2}</p>}
                      </>
                    ) : null
                  })()}

                <p className="text-sm mt-2">
                  <span className="font-semibold text-gray-700">Date &amp; Time:</span>{' '}
                  {item.slotDate.split('_').map(p => p.padStart(2,'0')).join('-')} | {item.slotTime}
                </p>

                {/* Status badges */}
                {item.cancelled && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                    Cancelled
                  </span>
                )}
                {!item.cancelled && item.payment && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                    Paid
                  </span>
                )}
              </div>

              {/* Actions */}
              {!item.cancelled && (
                <div className="flex flex-col gap-2">
                  {!item.payment && (
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
                      Pay Online
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(item._id)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments