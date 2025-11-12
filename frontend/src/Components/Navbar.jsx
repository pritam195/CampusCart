import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="bg-[#ff6a3d] shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-white text-2xl font-bold hover:opacity-90 transition">
                            CampusCart 🎓
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-md text-sm font-medium transition"
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-md text-sm font-medium transition"
                        >
                            Browse Items
                        </Link>

                        {isLoggedIn && (
                            <>
                                <Link
                                    to="/sell"
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Sell Item
                                </Link>
                                <Link
                                    to="/my-listings"
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    My Listings
                                </Link>
                                <Link
                                    to="/my-orders"
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    My Orders
                                </Link>

                                <Link
                                    to="/feedback"
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Feedback
                                </Link>
                                <Link
                                    to="/cart"
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-md text-sm font-medium transition relative"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {/* Cart count badge */}
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {JSON.parse(localStorage.getItem('cart') || '[]').length}
                                    </span>
                                </Link>

                                <Link
                                    to="/profile"
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Profile
                                </Link>

                            </>
                        )}
                    </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-white text-[#ff6a3d] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white border-2 border-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-[#ff6a3d] transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-[#ff6a3d] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#e55a2d] focus:outline-none transition"
                        >
                            <svg
                                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#ff6a3d]">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                    >
                        Home
                    </Link>
                    <Link
                        to="/products"
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                    >
                        Browse Items
                    </Link>

                    {isLoggedIn && (
                        <>
                            <Link
                                to="/sell"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                            >
                                Sell Item
                            </Link>
                            <Link
                                to="/my-listings"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                            >
                                My Listings
                            </Link>
                            <Link
                                to="/messages"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                            >
                                Messages
                            </Link>
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                            >
                                Profile
                            </Link>
                        </>
                    )}

                    {/* Mobile Auth Buttons */}
                    <div className="pt-4 pb-3 border-t border-white/20">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:bg-white hover:text-[#ff6a3d] block px-3 py-2 rounded-md text-base font-medium transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
