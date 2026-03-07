import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false)
  const [token, setToken] = useState(true) // Change this based on your auth logic

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-200 bg-white shadow-sm'>
      {/* Logo */}
      <img 
        onClick={() => navigate('/')} 
        className='w-44 cursor-pointer transition-transform hover:scale-105' 
        src={assets.logo} 
        alt="Logo" 
      />
      
      {/* Desktop Navigation */}
      <ul className='hidden md:flex items-center gap-8 font-medium'>
        <NavLink 
          to='/' 
          className={({ isActive }) => 
            `py-2 px-1 transition-colors duration-200 ${
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }`
          }
        >
          <li>HOME</li>
        </NavLink>
        
        <NavLink 
          to='/doctors'
          className={({ isActive }) => 
            `py-2 px-1 transition-colors duration-200 ${
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }`
          }
        >
          <li>ALL DOCTORS</li>
        </NavLink>
        
        <NavLink 
          to='/about'
          className={({ isActive }) => 
            `py-2 px-1 transition-colors duration-200 ${
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }`
          }
        >
          <li>ABOUT</li>
        </NavLink>
        
        <NavLink 
          to='/contact' // Fixed: lowercase 'c' to match route consistency
          className={({ isActive }) => 
            `py-2 px-1 transition-colors duration-200 ${
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }`
          }
        >
          <li>CONTACT</li>
        </NavLink>
      </ul>

      {/* User Actions */}
      <div className='flex items-center gap-4'>
        {token ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 h-8 rounded-full object-cover border-2 border-gray-200' src={assets.profile_pic} alt="Profile"/>
            <img className='w-2.5 transition-transform group-hover:rotate-180' src={assets.dropdown_icon} alt="Dropdown"/>
            
            {/* Dropdown Menu */}
            <div className='absolute top-full right-0 pt-2 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col gap-2 p-3'>
                <p 
                  onClick={() => navigate('/my-profile')} 
                  className='px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors'
                >
                  My Profile
                </p>
                <p 
                  onClick={() => navigate('/my-appointments')} 
                  className='px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors'
                >
                  My Appointments
                </p>
                <hr className='my-1'/>
                <p 
                  onClick={() => setToken(false)} 
                  className='px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer transition-colors'
                >
                  Logout
                </p>  
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className='bg-primary text-white px-6 py-2.5 rounded-full font-medium hidden md:block transition-all hover:bg-primary-dark hover:shadow-lg'
          >
            Create Account
          </button>
        )}
        
        {/* Mobile Menu Button */}
        <img 
          onClick={() => setShowMenu(true)} 
          className='w-6 cursor-pointer md:hidden' 
          src={assets.menu_icon} 
          alt="Menu" 
        />
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden'>
          <div className='absolute right-0 top-0 h-full w-80 bg-white shadow-xl'>
            {/* Mobile Menu Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <img className='w-32' src={assets.logo} alt="Logo" />
              <img 
                onClick={() => setShowMenu(false)} 
                className='w-6 cursor-pointer' 
                src={assets.cross_icon} 
                alt="" 
              />
            </div>
            
            {/* Mobile Navigation */}
            <ul className='p-6 flex flex-col gap-6'>
              <NavLink 
                to='/' 
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <li className='font-medium'>HOME</li>
              </NavLink>
              
              <NavLink 
                to='/doctors'
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <li className='font-medium'>ALL DOCTORS</li>
              </NavLink>
              
              <NavLink 
                to='/about'
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <li className='font-medium'>ABOUT</li>
              </NavLink>
              
              <NavLink 
                to='/contact'
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <li className='font-medium'>CONTACT</li>
              </NavLink>
              
              {!token && (
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/login');
                  }} 
                  className='bg-primary text-white py-3 px-4 rounded-full font-medium mt-4 hover:bg-primary-dark transition-colors'
                >
                  Create Account
                </button>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar