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
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">Filters</h3>
                <button
                    onClick={onReset}
                    className="text-sm font-semibold text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Reset All
                </button>
            </div>

            {}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Search
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search items..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange transition-all placeholder:text-slate-400 font-medium"
                    />
                    <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category
                </label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange transition-all font-medium text-slate-700 appearance-none"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat.toLowerCase()}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Condition
                </label>
                <select
                    name="condition"
                    value={filters.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange transition-all font-medium text-slate-700 appearance-none"
                >
                    {conditions.map((cond) => (
                        <option key={cond} value={cond.toLowerCase().replace(' ', '-')}>
                            {cond}
                        </option>
                    ))}
                </select>
            </div>

            {}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Price Range
                </label>
                <div className="flex gap-3">
                    <div className="relative w-1/2">
                        <span className="absolute left-3 top-3 text-slate-400 font-medium">₹</span>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleChange}
                            placeholder="Min"
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange transition-all font-medium"
                        />
                    </div>
                    <div className="relative w-1/2">
                        <span className="absolute left-3 top-3 text-slate-400 font-medium">₹</span>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            placeholder="Max"
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {}
            <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Sort By
                </label>
                <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange transition-all font-medium text-slate-700 appearance-none"
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
