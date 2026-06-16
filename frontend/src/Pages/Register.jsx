import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: 'VJTI',
        phone: '',
    });
    const [otpData, setOtpData] = useState({
        emailOtp: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { verifyOtpAndLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (e) => {
        setOtpData({ ...otpData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...userData } = formData;
            await API.post('/auth/send-otp', userData);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTPs');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOtpAndLogin({
                email: formData.email,
                emailOtp: otpData.emailOtp
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="max-w-xl w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-brand-orange/10">
                    <div className="text-center mb-8">
                        <span className="inline-block p-3 rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-bold text-brand-orange hover:text-rose-500 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium placeholder:text-slate-400"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium placeholder:text-slate-400"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium placeholder:text-slate-400"
                                        placeholder="Your phone number"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium placeholder:text-slate-400"
                                        placeholder="Min 6 characters"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium placeholder:text-slate-400"
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm mb-6 font-medium text-center">
                                    We've sent a one-time password to your email.
                                </div>

                                <div>
                                    <label htmlFor="emailOtp" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Email OTP
                                    </label>
                                    <input
                                        id="emailOtp"
                                        name="emailOtp"
                                        type="text"
                                        required
                                        value={otpData.emailOtp}
                                        onChange={handleOtpChange}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white transition-all font-medium text-center tracking-widest text-lg"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>



                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm font-bold text-brand-orange hover:text-rose-500 transition-colors w-full text-center mt-2"
                                >
                                    &larr; Back to edit details
                                </button>
                            </div>
                        )}

                        <div className="pt-4">
                            {step === 1 ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="w-full flex justify-center py-3.5 px-4 font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending OTPs...' : 'Continue to Verification'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    className="w-full flex justify-center py-3.5 px-4 font-bold rounded-xl text-white bg-gradient-to-r from-brand-orange to-rose-500 hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-brand-orange/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify & Complete Registration'
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
