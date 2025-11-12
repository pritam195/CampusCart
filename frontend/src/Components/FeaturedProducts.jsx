import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fallback mock data
    const fallbackProducts = [
        {
            _id: 1,
            title: 'Computer Science Textbook',
            price: 299,
            images: ['https://via.placeholder.com/300x200'],
            category: 'Books',
            seller: { name: 'John Doe' },
        },
        {
            _id: 2,
            title: 'Dell Laptop i5 8th Gen',
            price: 25000,
            images: ['https://via.placeholder.com/300x200'],
            category: 'Electronics',
            seller: { name: 'Sarah Smith' },
        },
        {
            _id: 3,
            title: 'Study Table with Chair',
            price: 1500,
            images: ['https://via.placeholder.com/300x200'],
            category: 'Furniture',
            seller: { name: 'Mike Johnson' },
        },
        {
            _id: 4,
            title: 'Engineering Calculator',
            price: 800,
            images: ['https://via.placeholder.com/300x200'],
            category: 'Electronics',
            seller: { name: 'Emily Brown' },
        },
    ];

    useEffect(() => {
        fetchRecentProducts();
    }, []);

    const fetchRecentProducts = async () => {
        setLoading(true);
        setError('');

        try {
            // Fetch 4 most recent products
            const { data } = await API.get('/products?limit=4&sort=newest');

            if (data.success && data.products.length > 0) {
                setProducts(data.products);
            } else {
                // Use fallback if no products available
                setProducts(fallbackProducts);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
            // Use fallback on error
            setProducts(fallbackProducts);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a3d]"></div>
                        <p className="mt-4 text-gray-600">Loading featured items...</p>
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
                        Featured Items
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Check out the latest items posted by students
                    </p>
                </div>

                {error && (
                    <div className="text-center mb-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600 mb-4">No products available yet</p>
                        <Link
                            to="/sell"
                            className="inline-block bg-[#ff6a3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                        >
                            Be the First to Sell
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                                >
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
                                        alt={product.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <span className="inline-block bg-[#ff6a3d]/10 text-[#ff6a3d] text-xs px-3 py-1 rounded-full mb-2">
                                            {product.category}
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            by {product.seller?.name || 'Anonymous'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-[#ff6a3d]">
                                                ₹{product.price}
                                            </span>
                                            <Link
                                                to={`/products/${product._id}`}
                                                className="bg-[#ff6a3d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e55a2d] transition"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                to="/products"
                                className="inline-block bg-[#ff6a3d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                            >
                                View All Products
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
