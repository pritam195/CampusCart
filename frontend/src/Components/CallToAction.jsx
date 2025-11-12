import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-16 bg-gradient-to-r from-[#ff6a3d] to-[#ff8c5a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Start Trading?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                    Join thousands of students buying and selling items on campus
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/register"
                        className="bg-white text-[#ff6a3d] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        to="/products"
                        className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#ff6a3d] transition"
                    >
                        Explore Marketplace
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
