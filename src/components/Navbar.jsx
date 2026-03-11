import { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { token, logout, userData } = useContext(AppContext);

    const navLinks = [
        { to: '/',            label: 'HOME' },
        { to: '/doctors',     label: 'ALL DOCTORS' },
        { to: '/about',       label: 'ABOUT' },
        { to: '/contact',     label: 'CONTACT' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowMenu(false);
    };
    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-200 bg-white shadow-sm'>
            {/* ── Logo ── */}
            <img
                onClick={() => navigate('/')}
                className='w-44 cursor-pointer transition-transform hover:scale-105'
                src={assets.logo}
                alt="Logo"
            />
            {/* ── Desktop Navigation ── */}
            <ul className='hidden md:flex items-center gap-8 font-medium'>
                {navLinks.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `py-2 px-1 transition-colors duration-200 ${
                                isActive
                                    ? 'text-primary font-semibold border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-primary'
                            }`
                        }
                    >
                        <li>{label}</li>
                    </NavLink>
                ))}
            </ul>
            {/* ── User Actions ── */}
            <div className='flex items-center gap-4'>
                {token ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        {/* ✅ Shows real user image once profile loads, else fallback */}
                        <img
                            className='w-9 h-9 rounded-full object-cover border-2 border-primary'
                            src={userData?.image || assets.profile_pic}
                            alt="Profile"
                        />
                        <img
                            className='w-2.5 transition-transform duration-200 group-hover:rotate-180'
                            src={assets.dropdown_icon}
                            alt="Dropdown"
                        />
                        {/* ── Dropdown Menu ── */}
                        <div className='absolute top-full right-0 pt-2 z-20 hidden group-hover:block'>
                            <div className='min-w-52 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col p-2'>
                                {/* ✅ Shows user name — userData is now populated from /api/user/profile */}
                                {userData?.name && (
                                    <>
                                        <div className='px-3 py-2'>
                                            <p className='text-xs text-gray-400'>Signed in as</p>
                                            <p className='text-sm font-semibold text-gray-700 truncate'>
                                                {userData.name}
                                            </p>
                                        </div>
                                        <hr className='my-1' />
                                    </>
                                )}
                                <p
                                    onClick={() => navigate('/my-profile')}
                                    className='px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg cursor-pointer transition-colors'
                                >
                                    My Profile
                                </p>
                                <p
                                    onClick={() => navigate('/my-appointments')}
                                    className='px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg cursor-pointer transition-colors'
                                >
                                    My Appointments
                                </p>
                                <hr className='my-1' />
                                <p
                                    onClick={handleLogout}
                                    className='px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors'
                                >
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-primary text-white px-6 py-2.5 rounded-full font-medium hidden md:block transition-all hover:shadow-lg hover:scale-105'
                    >
                        Create Account
                    </button>
                )}
                {/* ── Mobile Menu Button ── */}
                <img
                    onClick={() => setShowMenu(true)}
                    className='w-6 cursor-pointer md:hidden'
                    src={assets.menu_icon}
                    alt="Menu"
                />
            </div>
            {/* ── Mobile Menu ── */}
            {showMenu && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden'>
                    <div className='absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col'>

                        {/* Mobile Header */}
                        <div className='flex items-center justify-between p-5 border-b border-gray-200'>
                            <img className='w-32' src={assets.logo} alt="Logo" />
                            <img
                                onClick={() => setShowMenu(false)}
                                className='w-6 cursor-pointer hover:opacity-70'
                                src={assets.cross_icon}
                                alt="Close"
                            />
                        </div>
                        {/* ✅ User info in mobile — now correctly shows after profile loads */}
                        {token && userData && (
                            <div className='flex items-center gap-3 p-5 bg-gray-50 border-b border-gray-200'>
                                <img
                                    className='w-10 h-10 rounded-full object-cover border-2 border-primary'
                                    src={userData?.image || assets.profile_pic}
                                    alt="Profile"
                                />
                                <div>
                                    <p className='font-semibold text-gray-700 text-sm'>{userData.name}</p>
                                    <p className='text-xs text-gray-400 truncate'>{userData.email}</p>
                                </div>
                            </div>
                        )}
                        {/* Mobile Nav Links */}
                        <ul className='p-5 flex flex-col gap-3 flex-1'>
                            {navLinks.map(({ to, label }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={() => setShowMenu(false)}
                                    className={({ isActive }) =>
                                        `py-3 px-4 rounded-xl transition-colors font-medium ${
                                            isActive
                                                ? 'bg-primary text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <li>{label}</li>
                                </NavLink>
                            ))}
                        </ul>
                        {/* Mobile Auth Button */}
                        <div className='p-5 border-t border-gray-200'>
                            {token ? (
                                <button
                                    onClick={handleLogout}
                                    className='w-full bg-red-500 text-white py-3 rounded-full font-medium hover:bg-red-600 transition-colors'
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setShowMenu(false); navigate('/login'); }}
                                    className='w-full bg-primary text-white py-3 rounded-full font-medium hover:shadow-lg transition-all'
                                >
                                    Create Account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;