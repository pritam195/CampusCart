import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="bg-gradient-to-r from-[#ff6a3d] to-[#ff8c5a] text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Buy & Sell Student Items
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90">
                        The ultimate marketplace for students to resell books, electronics, furniture, and more!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/products"
                            className="bg-white text-[#ff6a3d] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                        >
                            Browse Items
                        </Link>
                        <Link
                            to="/sell"
                            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#ff6a3d] transition"
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
