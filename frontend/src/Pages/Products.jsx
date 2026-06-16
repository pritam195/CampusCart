import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductFilter from '../Components/ProductFilter';
import ProductCard from '../Components/ProductCard';

const Products = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
    });

    const [filters, setFilters] = useState({
        category: initialCategory,
        condition: 'all',
        minPrice: '',
        maxPrice: '',
        search: '',
        sort: 'newest',
    });

    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.currentPage]);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categoryParam !== filters.category) {
            setFilters(prev => ({ ...prev, category: categoryParam }));
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams({
                page: pagination.currentPage,
                limit: 12,
            });

            if (filters.category !== 'all') params.append('category', filters.category);
            if (filters.condition !== 'all') params.append('condition', filters.condition);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.search) params.append('search', filters.search);
            if (filters.sort) params.append('sort', filters.sort);

            const { data } = await API.get(`/products?${params.toString()}`);

            setProducts(data.products);
            setPagination({
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                total: data.total,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setFilters({
            category: 'all',
            condition: 'all',
            minPrice: '',
            maxPrice: '',
            search: '',
            sort: 'newest',
        });
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Browse Items</h1>
                    <p className="text-slate-500 font-medium">
                        Showing {products.length} of {pagination.total} items
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {}
                    <div className="lg:col-span-1">
                        <ProductFilter
                            filters={filters}
                            setFilters={setFilters}
                            onReset={handleResetFilters}
                        />
                    </div>

                    {}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-6 py-4 rounded-2xl font-medium shadow-sm">
                                {error}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                                <div className="text-6xl mb-6">🔍</div>
                                <p className="text-2xl text-slate-700 font-bold mb-3">No products found</p>
                                <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any items matching your current filters. Try adjusting them or clear filters to see all items.</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-orange hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center items-center space-x-3">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="px-5 py-2.5 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-brand-orange hover:border-brand-orange/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex space-x-2">
                                            {[...Array(pagination.totalPages)].map((_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                                                        pagination.currentPage === index + 1
                                                            ? 'bg-gradient-to-r from-brand-orange to-rose-500 text-white shadow-md'
                                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-orange hover:border-brand-orange/30'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="px-5 py-2.5 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-brand-orange hover:border-brand-orange/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
