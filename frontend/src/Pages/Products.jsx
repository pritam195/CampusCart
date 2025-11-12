import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductFilter from '../Components/ProductFilter';
import ProductCard from '../Components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
    });

    const [filters, setFilters] = useState({
        category: 'all',
        condition: 'all',
        minPrice: '',
        maxPrice: '',
        search: '',
        sort: 'newest',
    });

    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.currentPage]);

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
                    <p className="text-gray-600">
                        Showing {products.length} of {pagination.total} items
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <ProductFilter
                            filters={filters}
                            setFilters={setFilters}
                            onReset={handleResetFilters}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-xl text-gray-600">Loading products...</div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-600 mb-4">No products found</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="bg-[#ff6a3d] text-white px-6 py-2 rounded-lg hover:bg-[#e55a2d] transition"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        {[...Array(pagination.totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`px-4 py-2 rounded-lg ${pagination.currentPage === index + 1
                                                        ? 'bg-[#ff6a3d] text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
