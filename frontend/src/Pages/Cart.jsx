import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(cartData);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cart.map(item =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item._id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    const handleCheckout = () => {
        
        alert('Checkout functionality will be implemented');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden flex items-center justify-center">
                {}
                <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute bottom-20 -right-20 w-72 h-72 bg-rose-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="bg-white/80 backdrop-blur-xl border border-white p-10 rounded-3xl shadow-2xl shadow-brand-orange/10">
                        <span className="inline-block p-4 rounded-full bg-slate-50 text-slate-400 mb-6 border-2 border-slate-100 border-dashed">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Your cart is empty</h2>
                        <p className="text-slate-500 font-medium mb-8">Looks like you haven't added anything yet.</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-brand-orange to-rose-500 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
            {}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
                    <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-bold">
                        {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item._id} className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-sm hover:shadow-md transition-shadow p-5 group">
                                <div className="flex gap-5">
                                    <div className="relative">
                                        <img
                                            src={item.images?.[0] || 'https://via.placeholder.com/100'}
                                            alt={item.title}
                                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl bg-slate-50"
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-2xl"></div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <Link
                                                    to={`/products/${item._id}`}
                                                    className="text-xl font-bold text-slate-900 hover:text-brand-orange transition-colors line-clamp-1"
                                                >
                                                    {item.title}
                                                </Link>
                                                <p className="text-sm font-medium text-slate-500 mt-1">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 p-2 rounded-xl transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <p className="text-2xl font-black text-slate-900">₹{item.price}</p>
                                            
                                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                                                <button
                                                    onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-bold text-slate-900">{item.quantity || 1}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-2xl shadow-brand-orange/5 p-8 sticky top-24">
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 font-bold">₹{calculateTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-slate-900 font-bold">Free</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-900 font-bold">Total</span>
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-rose-500">₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-gradient-to-r from-brand-orange to-rose-500 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/products"
                                    className="block w-full text-center bg-slate-50 text-slate-700 py-4 rounded-xl font-bold border-2 border-slate-100 hover:bg-white hover:border-slate-200 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
