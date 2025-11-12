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
                // Clear cart
                localStorage.removeItem('cart');

                // Redirect to orders page
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-[#ff6a3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout & Schedule Meeting</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handlePlaceOrder} className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item._id} className="flex justify-between items-center py-2 border-b">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.images?.[0] || 'https://via.placeholder.com/60'}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{item.title}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-[#ff6a3d]">
                                        ₹{item.price * (item.quantity || 1)}
                                    </p>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 text-lg font-bold">
                                <span>Total Amount:</span>
                                <span className="text-[#ff6a3d]">₹{calculateTotal()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Meeting Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Schedule Campus Meeting
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Select a convenient location, date, and time to meet the seller on campus
                        </p>

                        <div className="space-y-4">
                            {/* Meeting Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meeting Location <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="location"
                                    value={meetingDetails.location}
                                    onChange={handleMeetingChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                                >
                                    {campusLocations.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Meeting Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meeting Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={meetingDetails.date}
                                    onChange={handleMeetingChange}
                                    min={getTomorrowDate()}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                                />
                            </div>

                            {/* Time Slot */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Time Slot <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="timeSlot"
                                    value={meetingDetails.timeSlot}
                                    onChange={handleMeetingChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                                >
                                    {timeSlots.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={meetingDetails.notes}
                                    onChange={handleMeetingChange}
                                    rows="3"
                                    maxLength="500"
                                    placeholder="Any specific instructions or landmarks..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {meetingDetails.notes.length}/500 characters
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                        <div className="space-y-3">
                            {['Cash on Delivery', 'UPI', 'Bank Transfer'].map((method) => (
                                <label key={method} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#ff6a3d] focus:ring-[#ff6a3d]"
                                    />
                                    <span className="text-gray-900">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#ff6a3d] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Placing Order...' : 'Confirm & Place Order'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/cart')}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            Back to Cart
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
