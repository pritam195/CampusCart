import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/imageUrl';

const ProductCard = ({ product }) => {
    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-brand-orange/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center p-2">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={product.title}
                    className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 right-3">
                    <span className="backdrop-blur-md bg-white/90 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 shadow-sm border border-white/50">
                        {product.condition}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-brand-orange/10 text-brand-orange font-semibold text-xs px-3 py-1.5 rounded-lg border border-brand-orange/20">
                        {product.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                        {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-brand-orange transition-colors">
                    {product.title}
                </h3>

                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <img
                        src={getImageUrl(product.seller?.avatar)}
                        alt={product.seller?.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm mr-3"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                            {product.seller?.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500 truncate">{product.seller?.university}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Price</span>
                        <span className="text-2xl font-extrabold text-slate-900">
                            ₹{product.price}
                        </span>
                    </div>
                    <Link
                        to={`/products/${product._id}`}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
