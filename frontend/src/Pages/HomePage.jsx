import React from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import FeaturedProducts from '../Components/FeaturedProducts';
import Categories from '../Components/Categories';
import HowItWorks from '../Components/HowItWorks';
import Testimonials from '../Components/Testimonials';
import CallToAction from '../Components/CallToAction';

const HomePage = () => {
    return (
        <div className="bg-gray-50">
            <Hero />
            <Categories />
            <FeaturedProducts />
            <HowItWorks />
            <Testimonials />
            <CallToAction />
        </div>
    );
};

export default HomePage;

