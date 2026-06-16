import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('buyer'); 
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
                fetchOrders(); 
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
                fetchOrders(); 
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
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
            {}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="inline-block p-3 rounded-2xl bg-brand-orange/10 text-brand-orange">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </span>
                            My Orders
                        </h1>
                        <p className="mt-2 text-slate-500 font-medium">Manage your purchases and sales</p>
                    </div>

                    {}
                    <div className="flex gap-2 p-1 bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-sm">
                        <button
                            onClick={() => setActiveTab('buyer')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'buyer'
                                    ? 'bg-gradient-to-r from-brand-orange to-rose-500 text-white shadow-lg shadow-brand-orange/30'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            My Purchases
                        </button>
                        <button
                            onClick={() => setActiveTab('seller')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'seller'
                                    ? 'bg-gradient-to-r from-brand-orange to-rose-500 text-white shadow-lg shadow-brand-orange/30'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            My Sales
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 mb-8">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-orange/20 border-t-brand-orange"></div>
                        <p className="mt-4 text-slate-500 font-bold">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm p-16 text-center max-w-2xl mx-auto">
                        <span className="inline-block p-4 rounded-full bg-slate-50 text-slate-400 mb-6 border-2 border-slate-100 border-dashed">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No {activeTab === 'buyer' ? 'purchases' : 'sales'} yet</h3>
                        <p className="text-slate-500 font-medium mb-8">
                            {activeTab === 'buyer' 
                                ? "Looks like you haven't bought anything. Start exploring!" 
                                : "You haven't sold anything yet. List an item today!"}
                        </p>
                        <Link
                            to={activeTab === 'buyer' ? "/products" : "/sell"}
                            className="inline-flex items-center justify-center bg-gradient-to-r from-brand-orange to-rose-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {activeTab === 'buyer' ? "Browse Products" : "Sell an Item"}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {}
                                    <div className="relative shrink-0">
                                        <img
                                            src={order.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                            alt={order.product?.title}
                                            className="w-full lg:w-48 h-48 object-cover rounded-2xl bg-slate-50"
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-2xl"></div>
                                    </div>

                                    {}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 border-b border-slate-100 pb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                                                    {order.product?.title}
                                                </h3>
                                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                                                    Order ID: {order._id.substring(0, 10).toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span
                                                    className={`px-4 py-1.5 rounded-xl text-sm font-bold shadow-sm ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>
                                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-rose-500">
                                                    ₹{order.totalAmount}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {}
                                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Meeting Details
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="font-bold text-slate-500">Location</span>
                                                        <span className="font-semibold text-slate-900">{order.meetingDetails?.location}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-bold text-slate-500">Date</span>
                                                        <span className="font-semibold text-slate-900">{new Date(order.meetingDetails?.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-bold text-slate-500">Time</span>
                                                        <span className="font-semibold text-slate-900">{order.meetingDetails?.timeSlot}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-bold text-slate-500">Payment</span>
                                                        <span className="font-semibold text-slate-900">{order.paymentMethod}</span>
                                                    </div>
                                                </div>
                                                {order.meetingDetails?.notes && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                                        <p className="text-sm font-bold text-slate-500 mb-1">Notes</p>
                                                        <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">{order.meetingDetails.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {}
                                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    {activeTab === 'buyer' ? 'Seller Info' : 'Buyer Info'}
                                                </h4>
                                                <div className="space-y-3">
                                                    <p className="font-bold text-slate-900 text-lg">
                                                        {activeTab === 'buyer' ? order.seller?.name : order.buyer?.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        {activeTab === 'buyer' ? order.seller?.email : order.buyer?.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        {activeTab === 'buyer' ? order.seller?.phone : order.buyer?.phone}
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 mt-4 text-right">
                                                        Ordered {new Date(order.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {}
                                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                                            {activeTab === 'seller' && order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Confirmed')}
                                                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
                                                >
                                                    Confirm Meeting
                                                </button>
                                            )}

                                            {activeTab === 'seller' && order.status === 'Confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Completed')}
                                                    className="bg-brand-orange text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-500 hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all"
                                                >
                                                    Mark as Completed
                                                </button>
                                            )}

                                            {(order.status === 'Pending' || order.status === 'Confirmed') && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="bg-white border-2 border-rose-100 text-rose-500 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-50 hover:border-rose-200 transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}

                                            <div className="flex-1"></div>

                                            <Link
                                                to={`/products/${order.product._id}`}
                                                className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
                                            >
                                                View Product
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
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
