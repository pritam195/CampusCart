import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from './ProductCard';

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
            images: ['https://via.placeholder.com/400x300'],
            category: 'Books',
            seller: { name: 'John Doe', university: 'VJTI' },
            createdAt: new Date().toISOString()
        },
        {
            _id: 2,
            title: 'Dell Laptop i5 8th Gen',
            price: 25000,
            images: ['https://via.placeholder.com/400x300'],
            category: 'Electronics',
            seller: { name: 'Sarah Smith', university: 'VJTI' },
            createdAt: new Date().toISOString()
        },
        {
            _id: 3,
            title: 'Study Table with Chair',
            price: 1500,
            images: ['https://via.placeholder.com/400x300'],
            category: 'Furniture',
            seller: { name: 'Mike Johnson', university: 'VJTI' },
            createdAt: new Date().toISOString()
        },
        {
            _id: 4,
            title: 'Engineering Calculator',
            price: 800,
            images: ['https://via.placeholder.com/400x300'],
            category: 'Electronics',
            seller: { name: 'Emily Brown', university: 'VJTI' },
            createdAt: new Date().toISOString()
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
                
                setProducts(fallbackProducts);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
            
            setProducts(fallbackProducts);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent"></div>
                        <p className="mt-4 text-slate-500 font-medium">Loading featured items...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-4 block">Top Picks</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Featured Items
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Check out the latest and most popular items posted by students across campus.
                    </p>
                </div>

                {error && (
                    <div className="text-center mb-8">
                        <p className="text-rose-500 font-medium">{error}</p>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
                        <p className="text-xl text-slate-600 mb-6 font-medium">No products available yet</p>
                        <Link
                            to="/sell"
                            className="inline-block bg-gradient-to-r from-brand-orange to-rose-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Be the First to Sell
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product._id || product.title} product={product} />
                            ))}
                        </div>

                        <div className="text-center mt-16">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center px-8 py-4 font-bold text-slate-700 transition-all duration-300 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-brand-orange/30 hover:text-brand-orange hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-slate-100"
                            >
                                View All Products
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
