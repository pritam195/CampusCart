import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Removed hardcoded fallbacks as per user request

    useEffect(() => {
        fetchRecentFeedback();
    }, []);

    const fetchRecentFeedback = async () => {
        try {
            const { data } = await API.get('/feedback/recent?limit=3');

            if (data.success && data.feedback.length > 0) {
                
                const formattedTestimonials = data.feedback.map((item) => ({
                    name: item.name,
                    role: item.category || 'Student',
                    comment: item.message,
                    rating: item.rating,
                    avatar: getInitials(item.name),
                }));
                setTestimonials(formattedTestimonials);
            } else {
                setTestimonials([]);
            }
        } catch (err) {
            console.error('Error fetching feedback:', err);
            setError('Could not load testimonials.');
            setTestimonials([]);
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
                        <p className="text-rose-500">{error}</p>
                    </div>
                )}

                {!loading && !error && testimonials.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 text-lg">No reviews yet. Check out our Feedback page to be the first!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-rose-500 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4 shadow-md border-2 border-white">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900">{testimonial.name}</h4>
                                        <p className="text-sm font-medium text-brand-orange">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex mb-4 gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-xl drop-shadow-sm">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 italic leading-relaxed">"{testimonial.comment}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
