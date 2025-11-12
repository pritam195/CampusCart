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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
                        <p className="text-gray-600">
                            You have {products.length} {products.length === 1 ? 'listing' : 'listings'}
                        </p>
                    </div>
                    <Link
                        to="/sell"
                        className="bg-[#ff6a3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                    >
                        + Add New Item
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl text-gray-600">Loading your listings...</div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg
                            className="mx-auto h-24 w-24 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No listings yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start selling by posting your first item
                        </p>
                        <Link
                            to="/sell"
                            className="inline-block bg-[#ff6a3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                        >
                            Post Your First Item
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.images?.[0] || 'https://via.placeholder.com/150'}
                                            alt={product.title}
                                            className="w-full md:w-40 h-40 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                    {product.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                        {product.category}
                                                    </span>
                                                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                        {product.condition}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(product.status)}`}>
                                                        {product.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-[#ff6a3d]">
                                                    ₹{product.price}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {product.views} views
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">
                                                Posted on {new Date(product.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3">
                                                {/* Status Dropdown */}
                                                <select
                                                    value={product.status}
                                                    onChange={(e) => handleStatusChange(product._id, e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                                                >
                                                    <option value="Available">Available</option>
                                                    <option value="Reserved">Reserved</option>
                                                    <option value="Sold">Sold</option>
                                                </select>

                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    to={`/edit-product/${product._id}`}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => setDeleteModal({ isOpen: true, productId: product._id })}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
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

                {/* Delete Confirmation Modal */}
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Delete Listing
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this listing? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, productId: null })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteModal.productId)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                                >
                                    Delete
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
