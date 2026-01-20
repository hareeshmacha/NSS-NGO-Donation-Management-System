import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Gift, Shield, Activity, CreditCard, CheckCircle } from 'lucide-react';

const Donate = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDonate = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!amount || amount <= 0) return alert('Please enter a valid amount');

        setLoading(true);

        try {
            const orderUrl = '/api/payment/create-order';
            const { data: order } = await axios.post(orderUrl, { amount: Number(amount) });

            const options = {
                key: "rzp_test_S5fpcMwbhtyUZC",
                amount: order.amount,
                currency: order.currency,
                name: "NGO Donation",
                description: "Contribution to Cause",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyUrl = '/api/payment/verify';
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        await axios.post(verifyUrl, verifyData);
                        alert('Donation Successful! Thank you.');
                        navigate('/my-donations');
                    } catch (error) {
                        console.error(error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#7C3AED",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert('Payment Failed');
                console.error(response.error);
            });
            rzp1.open();

        } catch (error) {
            console.error(error);
            alert('Error initiating donation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex">


            {/* Right Side - Donation Form */}
            <div className="w-full flex items-center justify-center p-6 lg:p-12 relative bg-slate-50 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                            <Gift className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Make a Donation</h2>
                        <p className="text-slate-500 text-sm mt-1">Choose an amount to donate</p>
                    </div>

                    <form onSubmit={handleDonate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Enter Amount</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-2xl group-focus-within:text-primary transition-colors">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 text-3xl font-bold text-center bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-800"
                                    placeholder="0"
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {[100, 500, 1000, 2000].map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(val)}
                                    className={`py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${Number(amount) === val
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                        }`}
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-800 leading-relaxed">
                                You will be redirected to the secure Razorpay gateway to complete your transaction. A receipt will be sent to your email.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/20 flex items-center justify-center space-x-2 group"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>{loading ? 'Processing...' : 'Proceed to Pay'}</span>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">
                            All donations are tax deductible under Section 80G.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Donate;
