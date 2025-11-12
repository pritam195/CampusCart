import React from 'react';

const ProductFilter = ({ filters, setFilters, onReset }) => {
    const categories = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Stationery', 'Other'];
    const conditions = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                    onClick={onReset}
                    className="text-sm text-[#ff6a3d] hover:text-[#e55a2d] font-medium"
                >
                    Reset All
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                </label>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search items..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                />
            </div>

            {/* Category */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat.toLowerCase()}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Condition */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                </label>
                <select
                    name="condition"
                    value={filters.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                >
                    {conditions.map((cond) => (
                        <option key={cond} value={cond.toLowerCase().replace(' ', '-')}>
                            {cond}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="Min"
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="Max"
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                </label>
                <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ProductFilter;
