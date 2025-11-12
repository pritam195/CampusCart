import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('buyer'); // 'buyer' or 'seller'
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, activeTab, navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');

        try {
            const endpoint = activeTab === 'buyer' ? '/orders/buyer' : '/orders/seller';
            const { data } = await API.get(endpoint);
            setOrders(data.orders);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const { data } = await API.put(`/orders/${orderId}/status`, {
                status: newStatus,
            });

            if (data.success) {
                fetchOrders(); // Refresh orders
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const { data } = await API.delete(`/orders/${orderId}`);

            if (data.success) {
                fetchOrders(); // Refresh orders
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('buyer')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'buyer'
                                ? 'bg-[#ff6a3d] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        My Purchases
                    </button>
                    <button
                        onClick={() => setActiveTab('seller')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'seller'
                                ? 'bg-[#ff6a3d] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        My Sales
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a3d]"></div>
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-xl text-gray-600 mb-4">
                            No {activeTab === 'buyer' ? 'purchases' : 'sales'} yet
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-[#ff6a3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image */}
                                    <img
                                        src={order.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                        alt={order.product?.title}
                                        className="w-full md:w-40 h-40 object-cover rounded-lg"
                                    />

                                    {/* Order Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {order.product?.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Order ID: {order._id.substring(0, 10)}...
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Meeting Details */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Meeting Details:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <p>
                                                    <span className="font-medium">Location:</span>{' '}
                                                    {order.meetingDetails?.location}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Date:</span>{' '}
                                                    {new Date(order.meetingDetails?.date).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Time:</span>{' '}
                                                    {order.meetingDetails?.timeSlot}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Payment:</span> {order.paymentMethod}
                                                </p>
                                            </div>
                                            {order.meetingDetails?.notes && (
                                                <p className="mt-2 text-sm">
                                                    <span className="font-medium">Notes:</span> {order.meetingDetails.notes}
                                                </p>
                                            )}
                                        </div>

                                        {/* Contact Info */}
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">
                                                    {activeTab === 'buyer' ? 'Seller' : 'Buyer'}:
                                                </span>{' '}
                                                {activeTab === 'buyer'
                                                    ? order.seller?.name
                                                    : order.buyer?.name}{' '}
                                                | {activeTab === 'buyer' ? order.seller?.email : order.buyer?.email} |{' '}
                                                {activeTab === 'buyer' ? order.seller?.phone : order.buyer?.phone}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Ordered on {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <p className="text-2xl font-bold text-[#ff6a3d]">
                                                ₹{order.totalAmount}
                                            </p>
                                            <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            {activeTab === 'seller' && order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Confirmed')}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                                                >
                                                    Confirm Meeting
                                                </button>
                                            )}

                                            {activeTab === 'seller' && order.status === 'Confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Completed')}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                                                >
                                                    Mark as Completed
                                                </button>
                                            )}

                                            {(order.status === 'Pending' || order.status === 'Confirmed') && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}

                                            <Link
                                                to={`/products/${order.product._id}`}
                                                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                                            >
                                                View Product
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
