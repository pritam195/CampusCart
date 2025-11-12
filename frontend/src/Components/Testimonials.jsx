import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fallback testimonials if no feedback in database
    const fallbackTestimonials = [
        {
            name: 'Priya Sharma',
            role: 'Engineering Student',
            comment: 'Sold my old textbooks within 2 days! Great platform for students.',
            rating: 5,
            avatar: 'PS',
        },
        {
            name: 'Rahul Kumar',
            role: 'MBA Student',
            comment: 'Found a laptop at an amazing price. The seller was very responsive.',
            rating: 5,
            avatar: 'RK',
        },
        {
            name: 'Ananya Singh',
            role: 'Law Student',
            comment: 'Safe and easy to use. Perfect for buying second-hand items on campus.',
            rating: 5,
            avatar: 'AS',
        },
    ];

    useEffect(() => {
        fetchRecentFeedback();
    }, []);

    const fetchRecentFeedback = async () => {
        try {
            const { data } = await API.get('/feedback/recent?limit=3');

            if (data.success && data.feedback.length > 0) {
                // Transform feedback data to testimonial format
                const formattedTestimonials = data.feedback.map((item) => ({
                    name: item.name,
                    role: item.category || 'Student',
                    comment: item.message,
                    rating: item.rating,
                    avatar: getInitials(item.name),
                }));
                setTestimonials(formattedTestimonials);
            } else {
                // Use fallback if no feedback available
                setTestimonials(fallbackTestimonials);
            }
        } catch (err) {
            console.error('Error fetching feedback:', err);
            // Use fallback on error
            setTestimonials(fallbackTestimonials);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length >= 2) {
            return names[0][0].toUpperCase() + names[1][0].toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-600">Loading testimonials...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Students Say
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Trusted by thousands of students across campuses
                    </p>
                </div>

                {error && (
                    <div className="text-center mb-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#ff6a3d] rounded-full flex items-center justify-center text-white font-bold mr-4">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="flex mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                                ))}
                            </div>
                            <p className="text-gray-700 italic line-clamp-3">"{testimonial.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
