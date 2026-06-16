import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const EditProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Books',
        condition: 'Good',
        location: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchLoading, setFetchLoading] = useState(true);

    const categories = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Stationery', 'Other'];
    const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProduct();
    }, [user, id, navigate]);

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/${id}`);

            if (data.product.seller._id !== user._id) {
                navigate('/my-listings');
                return;
            }

            setFormData({
                title: data.product.title,
                description: data.product.description,
                price: data.product.price,
                category: data.product.category,
                condition: data.product.condition,
                location: data.product.location || '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch product');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('condition', formData.condition);
            formDataToSend.append('location', formData.location);

            
            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const { data } = await API.post('/products', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data.success) {
                navigate('/my-listings');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };


    if (!user || fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
            {}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 text-center">
                    <span className="inline-block p-3 rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Edit Your Listing</h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">Update your product details to attract more buyers</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 mb-8">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {}
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-1.5">
                                Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium"
                                placeholder="E.g., Engineering Mathematics Textbook"
                            />
                        </div>

                        {}
                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1.5">
                                Description <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium resize-none"
                                placeholder="Describe your item, its condition, and any other relevant details..."
                            />
                        </div>

                        {}
                        <div>
                            <label htmlFor="price" className="block text-sm font-bold text-slate-700 mb-1.5">
                                Price (₹) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-500 font-bold">₹</span>
                                </div>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="condition" className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Condition <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="condition"
                                    name="condition"
                                    required
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium cursor-pointer"
                                >
                                    {conditions.map((cond) => (
                                        <option key={cond} value={cond}>
                                            {cond}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {}
                        <div>
                            <label htmlFor="location" className="block text-sm font-bold text-slate-700 mb-1.5">
                                Location (Optional)
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium"
                                placeholder="E.g., Hostel Block A, Main Gate"
                            />
                        </div>

                        {}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => navigate('/my-listings')}
                                className="w-full sm:w-1/3 px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-2/3 bg-gradient-to-r from-brand-orange to-rose-500 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Listing'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
