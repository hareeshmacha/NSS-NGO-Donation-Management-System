import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const MyDonations = () => {
    const { user } = useContext(AuthContext);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get('/api/payment/my-donations');
                setDonations(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    return (
        <div className="pt-20 min-h-screen container mx-auto px-4 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4"
            >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <User className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Impact History</h1>
                    <p className="text-slate-500">{user?.email}</p>
                </div>
            </motion.div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Donation History</h2>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : donations.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">You haven't made any donations yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 hidden md:table-cell">Reference ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((d, i) => (
                                    <tr key={d._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-800">
                                            ₹{d.amount}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${d.status === 'success' ? 'bg-green-100 text-green-800' :
                                                d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {d.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                {d.status === 'pending' && <div className="h-3 w-3 mr-1 rounded-full border-2 border-yellow-600 border-t-transparent animate-spin" />}
                                                {d.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                                                {d.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 font-mono text-sm hidden md:table-cell">
                                            {d.paymentGatewayId}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonations;
