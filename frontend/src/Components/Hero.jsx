import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-slate-50 min-h-[calc(100vh-80px)] flex items-center pt-20 pb-20">
            {}
            <div className="absolute top-0 -left-10 w-96 h-96 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-10 w-96 h-96 bg-rose-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-40 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="text-center max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-semibold mb-6 border border-brand-orange/20 tracking-wide">
                        🎓 Welcome to CampusCart
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-slate-900 leading-tight">
                        Buy & Sell <br/>
                        <span className="bg-gradient-to-r from-brand-orange via-rose-500 to-indigo-500 bg-clip-text text-transparent">
                            Student Items
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
                        The ultimate marketplace for students to safely resell books, electronics, furniture, and more on campus!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <Link
                            to="/products"
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-brand-orange to-rose-500 rounded-2xl hover:from-brand-light hover:to-rose-400 hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-brand-orange/50 overflow-hidden"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                            <span className="relative flex items-center gap-2">
                                Browse Items
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </Link>
                        <Link
                            to="/sell"
                            className="inline-flex items-center justify-center px-8 py-4 font-bold text-slate-700 transition-all duration-300 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-brand-orange/30 hover:text-brand-orange hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-slate-100"
                        >
                            Sell Your Items
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
