import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                        {product.condition}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-[#ff6a3d]/10 text-[#ff6a3d] text-xs px-3 py-1 rounded-full">
                        {product.category}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                    {product.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center mb-3">
                    <img
                        src={product.seller?.avatar || 'https://via.placeholder.com/40'}
                        alt={product.seller?.name}
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {product.seller?.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.seller?.university}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
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
    );
};

export default ProductCard;
