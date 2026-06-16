import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { getImageUrl } from '../services/imageUrl';

const Item = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
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

    const handleContactSeller = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await API.post('/chat/conversations', {
                productId: product._id
            });
            if (data.success) {
                navigate(`/chat/${data.conversation._id}`);
            }
        } catch (error) {
            console.error('Failed to create/open conversation', error);
            alert('Failed to start chat with seller.');
        }
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

    
    const sellerId = product.seller?._id || product.seller?.id || product.seller;
    const userId = user?._id || user?.id;
    const isOwner = user && sellerId && (sellerId.toString() === userId.toString());

    
    console.log('Seller ID:', sellerId);
    console.log('User ID:', userId);
    console.log('Is Owner:', isOwner);

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {}
                <nav className="mb-8 text-sm font-medium">
                    <Link to="/" className="text-slate-500 hover:text-brand-orange transition-colors">Home</Link>
                    <span className="mx-3 text-slate-300">/</span>
                    <Link to="/products" className="text-slate-500 hover:text-brand-orange transition-colors">Products</Link>
                    <span className="mx-3 text-slate-300">/</span>
                    <span className="text-slate-900">{product.title}</span>
                </nav>

                {}
                {cartMessage && (
                    <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl font-bold shadow-sm flex items-center gap-3">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {cartMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {}
                    <div>
                        <div className="bg-slate-50 rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-4 p-4 flex items-center justify-center h-[500px]">
                            <img
                                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x400'}
                                alt={product.title}
                                className="max-w-full max-h-full object-contain drop-shadow-md rounded-xl"
                            />
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`bg-white p-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImage === index ? 'border-brand-orange shadow-md scale-105' : 'border-transparent hover:border-brand-orange/30'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-full h-24 object-contain bg-slate-50 rounded-xl p-1"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {}
                    <div>
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <div className="mb-6">
                                <span className="inline-block bg-brand-orange/10 text-brand-orange font-bold text-xs px-4 py-2 rounded-xl mb-4 uppercase tracking-wider">
                                    {product.category}
                                </span>
                                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">{product.title}</h1>
                                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                    <span className={`px-4 py-1.5 rounded-xl font-bold ${getConditionColor(product.condition)}`}>
                                        {product.condition}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span>{product.views} views</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Posted {new Date(product.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mb-8 pb-8 border-b border-slate-100">
                                <div className="flex items-end gap-3">
                                    <span className="text-5xl font-extrabold text-slate-900">₹{product.price}</span>
                                    <span className="text-slate-400 font-medium mb-1 border-l-2 border-slate-200 pl-3">fixed price</span>
                                </div>
                            </div>

                            <div className="mb-8 pb-8 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">{product.description}</p>
                            </div>

                            <div className="mb-8 pb-8 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Details</h2>
                                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    {product.location && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Location</span>
                                            <span className="font-bold text-slate-900">{product.location}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Condition</span>
                                        <span className="font-bold text-slate-900">{product.condition}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Status</span>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{product.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8 pb-8 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Seller Information</h2>
                                <div className="flex items-center gap-5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <img
                                        src={getImageUrl(product.seller?.avatar)}
                                        alt={product.seller?.name}
                                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-orange/20"
                                    />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{product.seller?.name}</h3>
                                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            {product.seller?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {}
                            {!isOwner && product.status === 'Available' && (
                                <div className="space-y-4">
                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        Buy Now
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5 transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleContactSeller}
                                            className="w-full bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                        >
                                            Contact Seller
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isOwner && (
                                <div className="space-y-4">
                                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-2xl text-center font-bold">
                                        ✨ This is your listing
                                    </div>
                                    <Link
                                        to={`/edit-product/${product._id}`}
                                        className="block w-full bg-gradient-to-r from-brand-orange to-rose-500 text-white py-4 rounded-2xl font-bold text-lg text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        Edit Listing
                                    </Link>
                                    <Link
                                        to="/my-listings"
                                        className="block w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-center hover:bg-slate-200 transition-colors"
                                    >
                                        View All My Listings
                                    </Link>
                                </div>
                            )}

                            {product.status !== 'Available' && !isOwner && (
                                <div className="bg-slate-100 border border-slate-200 text-slate-600 px-6 py-4 rounded-2xl text-center font-bold flex items-center justify-center gap-3">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                    This item is no longer available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Item;
