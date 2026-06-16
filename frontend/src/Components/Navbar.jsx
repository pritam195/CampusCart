import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
        setIsOpen(false);
    };

    const linkBaseClass = "text-slate-600 hover:text-brand-orange hover:bg-brand-orange/10 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300";
    const mobileLinkBaseClass = "text-slate-600 hover:text-brand-orange hover:bg-brand-orange/10 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300";

    return (
        <nav className="backdrop-blur-xl bg-white/80 border-b border-slate-200/50 sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-orange to-rose-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-2">
                            <span className="text-3xl">🎓</span>
                            CampusCart
                        </Link>
                    </div>

                    {}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/" className={linkBaseClass}>Home</Link>
                        <Link to="/products" className={linkBaseClass}>Browse</Link>

                        {isLoggedIn && (
                            <>
                                <Link to="/sell" className={linkBaseClass}>Sell</Link>
                                <Link to="/my-listings" className={linkBaseClass}>My Listings</Link>
                                <Link to="/my-orders" className={linkBaseClass}>Orders</Link>
                                <Link to="/chat" className={linkBaseClass}>Chats</Link>
                                <Link to="/feedback" className={linkBaseClass}>Feedback</Link>
                            </>
                        )}
                    </div>

                    {}
                    <div className="hidden md:flex items-center space-x-3">
                        {isLoggedIn ? (
                            <>
                                <Link to="/cart" className={`${linkBaseClass} relative group`}>
                                    <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                                        {JSON.parse(localStorage.getItem('cart') || '[]').length}
                                    </span>
                                </Link>
                                <Link to="/profile" className={linkBaseClass}>Profile</Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white bg-slate-900 hover:bg-rose-500 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-brand-orange to-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-brand-orange focus:outline-none transition-colors"
                        >
                            <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {}
            <div className={`md:hidden absolute w-full bg-white/95 backdrop-blur-3xl border-b border-slate-200 shadow-xl transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div className="px-4 pt-2 pb-6 space-y-1">
                    <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkBaseClass}>Home</Link>
                    <Link to="/products" onClick={() => setIsOpen(false)} className={mobileLinkBaseClass}>Browse Items</Link>

                    {isLoggedIn && (
                        <>
                            <Link to="/sell" onClick={() => setIsOpen(false)} className={mobileLinkBaseClass}>Sell Item</Link>
                            <Link to="/my-listings" onClick={() => setIsOpen(false)} className={mobileLinkBaseClass}>My Listings</Link>
                            <Link to="/my-orders" onClick={() => setIsOpen(false)} className={mobileLinkBaseClass}>Orders</Link>
                            <Link to="/cart" onClick={() => setIsOpen(false)} className={`${mobileLinkBaseClass} flex justify-between items-center`}>
                                <span>Cart</span>
                                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {JSON.parse(localStorage.getItem('cart') || '[]').length}
                                </span>
                            </Link>
                            <Link to="/chat" onClick={() => setIsOpen(false)} className={mobileLinkBaseClass}>Chats</Link>
                            <Link to="/profile" onClick={() => setIsOpen(false)} className={mobileLinkBaseClass}>Profile</Link>
                        </>
                    )}

                    <div className="pt-4 mt-2 border-t border-slate-200/60 flex flex-col gap-3">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-center text-rose-500 bg-rose-50 hover:bg-rose-100 px-4 py-3 rounded-xl text-base font-semibold transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 px-4 py-3 rounded-xl text-base font-semibold transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center bg-gradient-to-r from-brand-orange to-rose-500 text-white px-4 py-3 rounded-xl text-base font-semibold shadow-md"
                                >
                                    Sign up
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
