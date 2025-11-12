import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Navbar';
import Home from './Pages/HomePage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Products from './Pages/Products';
import ProtectedRoute from './Components/ProtectedRoute';
import SellItem from './Pages/SellItem';
import MyListings from './Pages/MyListings';
import EditProduct from './Pages/EditProduct';
import Profile from './Pages/Profile';
import Feedback from './Pages/Feedback';
import Item from './Pages/Item';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import MyOrders from './Pages/MyOrders';

function App() {
  return (
    <AuthProvider>
      
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path='/sell' element={<SellItem />} />
            <Route path='/feedback' element={<Feedback />}></Route>
            <Route path='/products/:id' element={<Item />}></Route>
            <Route path='/cart' element={<Cart />}></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
            <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
