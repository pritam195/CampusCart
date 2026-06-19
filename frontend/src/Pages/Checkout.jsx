import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [meetingDetails, setMeetingDetails] = useState({
        location: 'Main Gate',
        date: '',
        timeSlot: '09:00 AM - 10:00 AM',
        notes: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    const campusLocations = [
        'Main Gate',
        'Library',
        'Canteen',
        'Admin Building',
        'Hostel Block A',
        'Hostel Block B',
        'Sports Complex',
        'Academic Block 1',
        'Academic Block 2',
        'Parking Area',
    ];

    const timeSlots = [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '12:00 PM - 01:00 PM',
        '01:00 PM - 02:00 PM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '04:00 PM - 05:00 PM',
        '05:00 PM - 06:00 PM',
    ];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [user, navigate]);

    const loadCart = () => {
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(cartData);
    };

    const handleMeetingChange = (e) => {
        const { name, value } = e.target;
        setMeetingDetails((prev) => ({ ...prev, [name]: value }));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!meetingDetails.date) {
            setError('Please select a meeting date');
            setLoading(false);
            return;
        }

        const selectedDate = new Date(meetingDetails.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError('Please select a future date');
            setLoading(false);
            return;
        }

        try {
            const orderData = {
                items: cart.map((item) => ({
                    productId: item._id,
                    quantity: item.quantity || 1,
                })),
                meetingDetails,
                paymentMethod,
            };

            const { data } = await API.post('/orders', orderData);

            if (data.success) {
                
                localStorage.removeItem('cart');

                
                navigate('/my-orders');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden flex items-center justify-center">
                {}
                <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute bottom-20 -right-20 w-72 h-72 bg-rose-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="bg-white/80 backdrop-blur-xl border border-white p-10 rounded-3xl shadow-2xl shadow-brand-orange/10">
                        <span className="inline-block p-4 rounded-full bg-slate-50 text-slate-400 mb-6 border-2 border-slate-100 border-dashed">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Your cart is empty</h2>
                        <p className="text-slate-500 font-medium mb-8">Add items to your cart to proceed to checkout.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-brand-orange to-rose-500 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
            {}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 text-center">
                    <span className="inline-block p-3 rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
                    <p className="mt-2 text-slate-500 font-medium">Review your items and schedule a campus meeting</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 mb-8">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handlePlaceOrder} className="space-y-8">
                    {}
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-5 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Order Summary
                        </h2>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item._id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={item.images?.[0] || 'https://via.placeholder.com/60'}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover rounded-xl bg-slate-50"
                                            />
                                            <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-xl"></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{item.title}</p>
                                            <p className="text-sm font-medium text-slate-500 mt-0.5">Qty: {item.quantity || 1}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-slate-900">
                                        ₹{item.price * (item.quantity || 1)}
                                    </p>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-6 text-xl font-bold border-t border-slate-100">
                                <span className="text-slate-900">Total Amount</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-rose-500 text-3xl font-black">₹{calculateTotal()}</span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-5 md:p-8">
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                                <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Schedule Campus Meeting
                            </h2>
                            <p className="text-slate-500 font-medium">
                                Select a convenient location, date, and time to meet the seller on campus
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Meeting Location <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    name="location"
                                    value={meetingDetails.location}
                                    onChange={handleMeetingChange}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium"
                                >
                                    {campusLocations.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Meeting Date <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={meetingDetails.date}
                                    onChange={handleMeetingChange}
                                    min={getTomorrowDate()}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Time Slot <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    name="timeSlot"
                                    value={meetingDetails.timeSlot}
                                    onChange={handleMeetingChange}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium"
                                >
                                    {timeSlots.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={meetingDetails.notes}
                                    onChange={handleMeetingChange}
                                    rows="3"
                                    maxLength="500"
                                    placeholder="Any specific instructions, landmarks, or how to identify you..."
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium placeholder:text-slate-400 resize-none"
                                />
                                <p className="text-xs font-bold text-slate-400 mt-2 text-right">
                                    {meetingDetails.notes.length}/500
                                </p>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-5 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Payment Method
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['Cash on Delivery', 'UPI', 'Bank Transfer'].map((method) => (
                                <label key={method} className={`relative flex cursor-pointer rounded-xl border-2 p-4 focus:outline-none transition-all ${paymentMethod === method ? 'border-brand-orange bg-brand-orange/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex w-full items-center justify-between">
                                        <span className={`text-sm font-bold ${paymentMethod === method ? 'text-brand-orange' : 'text-slate-900'}`}>{method}</span>
                                        {paymentMethod === method && (
                                            <svg className="h-5 w-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => navigate('/cart')}
                            className="w-full sm:w-1/3 px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                        >
                            Back to Cart
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-2/3 bg-gradient-to-r from-brand-orange to-rose-500 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Placing Order...
                                </>
                            ) : (
                                'Confirm & Place Order'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
