import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Activity, Download, LayoutGrid, List, UserCircle, LogOut, Search, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, totalDonations: 0, totalAmount: 0 });
    const [donations, setDonations] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, donRes, usersRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/admin/donations'),
                    axios.get('/api/admin/users')
                ]);

                setStats(statsRes.data);
                setDonations(donRes.data);
                setUsersList(usersRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const exportToCSV = () => {
        const headers = ["Date", "Donor Name", "Amount", "Currency", "Status", "Payment ID"];
        const rows = donations.map(d => [
            new Date(d.createdAt).toLocaleDateString(),
            d.userId ? d.userId.name : 'Unknown',
            d.amount,
            d.currency,
            d.status,
            d.paymentGatewayId
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "donations_report.csv");
        document.body.appendChild(link);
        link.click();
    };


    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString();
        }).reverse();

        const data = last7Days.map(date => {
            const dayDonations = donations.filter(d => new Date(d.createdAt).toLocaleDateString() === date && d.status === 'success');
            const total = dayDonations.reduce((sum, d) => sum + d.amount, 0);
            return {
                name: date,
                amount: total,
                count: dayDonations.length
            };
        });
        return data;
    };

    const chartData = getChartData();

    const SidebarItem = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === id
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 sticky top-24">
                            <div className="space-y-2">
                                <SidebarItem id="overview" label="Overview" icon={LayoutGrid} />
                                <SidebarItem id="donations" label="Donations" icon={DollarSign} />
                                <SidebarItem id="users" label="Users" icon={Users} />
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <button onClick={() => { logout(); }} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">NSS Administration Portal</h2>
                                    <p className="text-slate-500 mb-6">Manage volunteers, monitor donations, and oversee operations.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatCard
                                            title="Total Funds Raised"
                                            value={`₹${stats.totalAmount}`}
                                            icon={<DollarSign className="h-6 w-6 text-green-600" />}
                                            color="bg-green-100/50"
                                        />
                                        <StatCard
                                            title="Registered Volunteers"
                                            value={stats.totalUsers}
                                            icon={<Users className="h-6 w-6 text-primary" />}
                                            color="bg-primary/10"
                                        />
                                        <StatCard
                                            title="Total Donations"
                                            value={stats.totalDonations}
                                            icon={<Activity className="h-6 w-6 text-secondary" />}
                                            color="bg-secondary/10"
                                        />
                                    </div>


                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                            <h3 className="text-lg font-bold text-slate-800 mb-6">Donation Trends (Last 7 Days)</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={chartData}>
                                                        <defs>
                                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#303f9f" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#303f9f" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Area type="monotone" dataKey="amount" stroke="#303f9f" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>


                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                            <h3 className="text-lg font-bold text-slate-800 mb-6">Daily Transactions</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={chartData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip
                                                            cursor={{ fill: '#f8fafc' }}
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Bar dataKey="count" fill="#d32f2f" radius={[4, 4, 0, 0]} barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'donations' && (
                                <motion.div
                                    key="donations"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-slate-800">All Donations</h2>
                                        <button onClick={exportToCSV} className="btn-secondary flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                                            <Download className="h-4 w-4" />
                                            <span>Export CSV</span>
                                        </button>
                                    </div>


                                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by donor name..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                            />
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                min={startDate}
                                                className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                            />
                                            {(startDate || endDate) && (
                                                <button
                                                    onClick={() => { setStartDate(''); setEndDate(''); }}
                                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                        <DonationTable
                                            donations={donations.filter(d => {
                                                const matchesSearch = d.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
                                                if (!matchesSearch) return false;

                                                const donationDate = new Date(d.createdAt);


                                                if (startDate) {
                                                    const start = new Date(startDate + 'T00:00:00');
                                                    if (donationDate < start) return false;
                                                }
                                                if (endDate) {
                                                    const end = new Date(endDate + 'T23:59:59.999');
                                                    if (donationDate > end) return false;
                                                }

                                                return true;
                                            })}
                                            onUserClick={(user) => {

                                                const fullUser = usersList.find(u => u._id === user._id) || user;
                                                setSelectedUser(fullUser);
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'users' && (
                                <motion.div
                                    key="users"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Registered Users</h2>


                                    <div className="relative mb-6">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search users by name or email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                                                    <tr>
                                                        <th className="p-4">Name</th>
                                                        <th className="p-4">Email</th>
                                                        <th className="p-4">Role</th>
                                                        <th className="p-4">Joined On</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {usersList
                                                        .filter(u =>
                                                            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            u.email.toLowerCase().includes(searchTerm.toLowerCase())
                                                        )
                                                        .map((u) => (
                                                            <tr key={u._id} className="hover:bg-slate-50">
                                                                <td className="p-4">
                                                                    <button
                                                                        onClick={() => setSelectedUser(u)}
                                                                        className="font-medium text-primary hover:text-primary-dark hover:underline text-left"
                                                                    >
                                                                        {u.name}
                                                                    </button>
                                                                </td>
                                                                <td className="p-4 text-slate-600">{u.email}</td>
                                                                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">{u.role}</span></td>
                                                                <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                            </tr>
                                                        ))}
                                                    {usersList.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="p-8 text-center text-slate-500">No users found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}


                        </AnimatePresence>
                    </div>
                </div>
            </div>


            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="text-xl font-bold text-slate-800">User Details</h3>
                                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                                        {selectedUser.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">{selectedUser.name}</h4>
                                        <p className="text-slate-500">{selectedUser.email}</p>
                                        <span className="mt-1 inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full uppercase">{selectedUser.role}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 font-medium mb-1">Joined On</p>
                                        <p className="font-semibold text-slate-800">
                                            {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 font-medium mb-1">Total Donations</p>
                                        <p className="font-semibold text-slate-800">
                                            ₹{donations.filter(d => d.userId?._id === selectedUser._id && d.status === 'success').reduce((sum, d) => sum + d.amount, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-panel p-6 flex items-center space-x-4 hover:scale-105 transition-transform duration-300">
        <div className={`p-4 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </div>
);

const DonationTable = ({ donations, onUserClick }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Donor</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Order ID</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50">
                        <td className="p-4 text-slate-600">{new Date(d.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                            <button
                                onClick={() => d.userId && onUserClick(d.userId)}
                                className="font-medium text-primary hover:text-primary-dark hover:underline text-left"
                            >
                                {d.userId?.name || 'Unknown'}
                            </button>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">₹{d.amount}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'success' ? 'bg-green-100 text-green-800' :
                                d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {d.status.toUpperCase()}
                            </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-sm">{d.paymentGatewayId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminDashboard;
