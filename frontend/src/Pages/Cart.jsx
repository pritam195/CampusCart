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
        // Implement checkout logic
        alert('Checkout functionality will be implemented');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-24 w-24 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some items to get started!</p>
                        <Link
                            to="/products"
                            className="inline-block bg-[#ff6a3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex gap-4">
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/100'}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <Link
                                            to={`/products/${item._id}`}
                                            className="text-lg font-semibold text-gray-900 hover:text-[#ff6a3d]"
                                        >
                                            {item.title}
                                        </Link>
                                        <p className="text-sm text-gray-600">{item.category}</p>
                                        <p className="text-lg font-bold text-[#ff6a3d] mt-2">₹{item.price}</p>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="font-medium">{item.quantity || 1}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{calculateTotal()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items</span>
                                    <span className="font-medium">{cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#ff6a3d]">₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#ff6a3d] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2d] transition mb-3"
                            >
                                Proceed to Checkout
                            </button>


                            <Link
                                to="/products"
                                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
