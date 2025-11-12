import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Item = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        setError('');

        try {
            const { data } = await API.get(`/products/${id}`);
            setProduct(data.product);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingIndex = cart.findIndex(item => item._id === product._id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        setCartMessage('Added to cart successfully!');

        setTimeout(() => setCartMessage(''), 3000);
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        handleAddToCart();
        setTimeout(() => {
            navigate('/cart');
        }, 500);
    };

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'New':
                return 'bg-green-100 text-green-800';
            case 'Like New':
                return 'bg-blue-100 text-blue-800';
            case 'Good':
                return 'bg-yellow-100 text-yellow-800';
            case 'Fair':
                return 'bg-orange-100 text-orange-800';
            case 'Poor':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a3d]"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'This product does not exist'}</p>
                    <Link
                        to="/products"
                        className="bg-[#ff6a3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    // FIX: Check ownership properly - handle both _id and id fields
    const sellerId = product.seller?._id || product.seller?.id || product.seller;
    const userId = user?._id || user?.id;
    const isOwner = user && sellerId && (sellerId.toString() === userId.toString());

    // Debug logs (remove after testing)
    console.log('Seller ID:', sellerId);
    console.log('User ID:', userId);
    console.log('Is Owner:', isOwner);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm">
                    <Link to="/" className="text-gray-500 hover:text-[#ff6a3d]">Home</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link to="/products" className="text-gray-500 hover:text-[#ff6a3d]">Products</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900">{product.title}</span>
                </nav>

                {/* Success Message */}
                {cartMessage && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {cartMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Images */}
                    <div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                            <img
                                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x400'}
                                alt={product.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`bg-white rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-[#ff6a3d]' : 'border-gray-200'
                                            } hover:border-[#ff6a3d] transition`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-full h-20 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Details */}
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-4">
                                <span className="inline-block bg-[#ff6a3d]/10 text-[#ff6a3d] text-sm px-3 py-1 rounded-full mb-2">
                                    {product.category}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className={`px-3 py-1 rounded-full font-medium ${getConditionColor(product.condition)}`}>
                                        {product.condition}
                                    </span>
                                    <span>•</span>
                                    <span>{product.views} views</span>
                                    <span>•</span>
                                    <span>Posted {new Date(product.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-[#ff6a3d]">₹{product.price}</span>
                                    <span className="text-gray-500 text-lg">fixed price</span>
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Details</h2>
                                <div className="space-y-2">
                                    {product.location && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Location:</span>
                                            <span className="font-medium text-gray-900">{product.location}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Condition:</span>
                                        <span className="font-medium text-gray-900">{product.condition}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium text-green-600">{product.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Seller Information</h2>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={product.seller?.avatar || 'https://via.placeholder.com/60'}
                                        alt={product.seller?.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{product.seller?.name}</h3>
                                        {/* <p className="text-sm text-gray-600">{product.seller?.university}</p> */}
                                        <p className="text-sm text-gray-600">{product.seller?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {!isOwner && product.status === 'Available' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full bg-[#ff6a3d] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-white border-2 border-[#ff6a3d] text-[#ff6a3d] py-3 rounded-lg font-semibold hover:bg-[#ff6a3d] hover:text-white transition"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                                    >
                                        Contact Seller
                                    </button>
                                </div>
                            )}

                            {isOwner && (
                                <div className="space-y-3">
                                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-center">
                                        This is your listing
                                    </div>
                                    <Link
                                        to={`/edit-product/${product._id}`}
                                        className="block w-full bg-[#ff6a3d] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#e55a2d] transition"
                                    >
                                        Edit Listing
                                    </Link>
                                    <Link
                                        to="/my-listings"
                                        className="block w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold text-center hover:bg-gray-200 transition"
                                    >
                                        View My Listings
                                    </Link>
                                </div>
                            )}

                            {product.status !== 'Available' && !isOwner && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center">
                                    This item is no longer available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Seller Modal */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Seller</h3>
                        <div className="space-y-3 mb-6">
                            <p className="text-gray-700">
                                <strong>Name:</strong> {product.seller?.name}
                            </p>
                            <p className="text-gray-700">
                                <strong>Email:</strong>{' '}
                                <a href={`mailto:${product.seller?.email}`} className="text-[#ff6a3d] hover:underline">
                                    {product.seller?.email}
                                </a>
                            </p>
                            {product.seller?.phone && (
                                <p className="text-gray-700">
                                    <strong>Phone:</strong>{' '}
                                    <a href={`tel:${product.seller?.phone}`} className="text-[#ff6a3d] hover:underline">
                                        {product.seller?.phone}
                                    </a>
                                </p>
                            )}
                            <p className="text-gray-700">
                                <strong>University:</strong> {product.seller?.university}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowContactModal(false)}
                            className="w-full bg-[#ff6a3d] text-white py-2 rounded-lg font-medium hover:bg-[#e55a2d] transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Item;
