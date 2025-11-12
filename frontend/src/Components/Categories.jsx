import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
    const categories = [
        { name: 'Books', icon: '📚', count: '250+' },
        { name: 'Electronics', icon: '💻', count: '180+' },
        { name: 'Furniture', icon: '🪑', count: '120+' },
        { name: 'Clothing', icon: '👕', count: '300+' },
        { name: 'Sports', icon: '⚽', count: '90+' },
        { name: 'Stationery', icon: '✏️', count: '150+' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse Categories
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Find exactly what you need from our popular categories
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={`/products?category=${category.name.toLowerCase()}`}
                            className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-[#ff6a3d]"
                        >
                            <div className="text-5xl mb-3">{category.icon}</div>
                            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.count} items</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
