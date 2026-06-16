import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyListings();
    }, [user, navigate]);

    const fetchMyListings = async () => {
        setLoading(true);
        setError('');

        try {
            const { data } = await API.get('/products/my-listings');
            setProducts(data.products);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const { data } = await API.delete(`/products/${productId}`);

            if (data.success) {
                setProducts(products.filter((product) => product._id !== productId));
                setDeleteModal({ isOpen: false, productId: null });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleStatusChange = async (productId, newStatus) => {
        try {
            const { data } = await API.put(`/products/${productId}`, { status: newStatus });

            if (data.success) {
                setProducts(
                    products.map((product) =>
                        product._id === productId ? { ...product, status: newStatus } : product
                    )
                );
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available':
                return 'bg-green-100 text-green-800';
            case 'Sold':
                return 'bg-red-100 text-red-800';
            case 'Reserved':
                return 'bg-yellow-100 text-yellow-800';
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
                {}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="inline-block p-3 rounded-2xl bg-brand-orange/10 text-brand-orange">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </span>
                            My Listings
                        </h1>
                        <p className="mt-2 text-slate-500 font-medium">
                            You have <span className="text-brand-orange font-bold">{products.length}</span> active {products.length === 1 ? 'listing' : 'listings'}
                        </p>
                    </div>
                    <Link
                        to="/sell"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-brand-orange to-rose-500 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300 gap-2 shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add New Item
                    </Link>
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
                        <p className="mt-4 text-slate-500 font-bold">Loading your listings...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm p-16 text-center max-w-2xl mx-auto">
                        <span className="inline-block p-4 rounded-full bg-slate-50 text-slate-400 mb-6 border-2 border-slate-100 border-dashed">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                            No listings yet
                        </h3>
                        <p className="text-slate-500 font-medium mb-8">
                            Start selling by posting your first item to the campus community.
                        </p>
                        <Link
                            to="/sell"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-brand-orange to-rose-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Post Your First Item
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8"
                            >
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {}
                                    <div className="relative shrink-0">
                                        <img
                                            src={product.images?.[0] || 'https://via.placeholder.com/150'}
                                            alt={product.title}
                                            className="w-full lg:w-48 h-48 object-cover rounded-2xl bg-slate-50"
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-2xl"></div>
                                    </div>

                                    {}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                                        {product.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-medium">
                                                            {product.category}
                                                        </span>
                                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-medium">
                                                            {product.condition}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-lg font-bold shadow-sm ${getStatusColor(product.status)}`}>
                                                            {product.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right sm:text-left flex flex-col sm:items-end">
                                                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-rose-500">
                                                        ₹{product.price}
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        {product.views} views
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-slate-600 mb-6 line-clamp-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                            <div className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Posted {new Date(product.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>

                                            {}
                                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                                {}
                                                <select
                                                    value={product.status}
                                                    onChange={(e) => handleStatusChange(product._id, e.target.value)}
                                                    className="appearance-none px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all cursor-pointer flex-1 sm:flex-none"
                                                >
                                                    <option value="Available">Available</option>
                                                    <option value="Reserved">Reserved</option>
                                                    <option value="Sold">Sold</option>
                                                </select>

                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    to={`/edit-product/${product._id}`}
                                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => setDeleteModal({ isOpen: true, productId: product._id })}
                                                    className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {}
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all">
                            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                                Delete Listing?
                            </h3>
                            <p className="text-slate-500 font-medium mb-8">
                                Are you sure you want to delete this listing? This action cannot be undone and it will be permanently removed.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, productId: null })}
                                    className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteModal.productId)}
                                    className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all"
                                >
                                    Delete Listing
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListings;
