import { AdminSidebar } from '../components/AdminSidebar';
import { DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router';

const revenueData = [
  { day: 'Mon', revenue: 4500 },
  { day: 'Tue', revenue: 5200 },
  { day: 'Wed', revenue: 4800 },
  { day: 'Thu', revenue: 6100 },
  { day: 'Fri', revenue: 7800 },
  { day: 'Sat', revenue: 8200 },
  { day: 'Sun', revenue: 7100 },
];

const ordersData = [
  { day: 'Mon', orders: 145 },
  { day: 'Tue', orders: 165 },
  { day: 'Wed', orders: 152 },
  { day: 'Thu', orders: 198 },
  { day: 'Fri', orders: 245 },
  { day: 'Sat', orders: 278 },
  { day: 'Sun', orders: 201 },
];

const recentOrders = [
  { id: '#ORD-2451', customer: 'Ahmad Ali', restaurant: 'Pizza Paradise', amount: 24.50, status: 'preparing', time: '15 min ago' },
  { id: '#ORD-2450', customer: 'Sarah Khan', restaurant: 'Burger House', amount: 18.99, status: 'delivery', time: '28 min ago' },
  { id: '#ORD-2449', customer: 'Mike Brown', restaurant: 'Tokyo Sushi', amount: 32.50, status: 'preparing', time: '35 min ago' },
  { id: '#ORD-2448', customer: 'Lisa Wong', restaurant: 'Italian Bistro', amount: 28.75, status: 'delivered', time: '1 hr ago' },
  { id: '#ORD-2447', customer: 'John Doe', restaurant: 'Pizza Paradise', amount: 45.20, status: 'delivered', time: '2 hrs ago' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10 dark:bg-black dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-1">Dashboard Overview</h1>
              <p className="text-gray-600 dark:text-gray-300">Monitor your platform performance</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/restaurants')}
                className="px-6 py-2 border-2 border-[#e95322] text-[#e95322] rounded-xl hover:bg-[#fef2ef] transition-colors dark:hover:bg-gray-900"
              >
                Manage Restaurants
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-6 py-2 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors"
              >
                Manage Users
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>12.5%</span>
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-1 dark:text-gray-300">Total Revenue</div>
              <div className="text-3xl">$45,231</div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>8.3%</span>
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-1 dark:text-gray-300">Total Orders</div>
              <div className="text-3xl">1,465</div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>3.2%</span>
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-1 dark:text-gray-300">Active Users</div>
              <div className="text-3xl">8,234</div>
            </div>

            {/* Avg. Delivery Time */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>5.1%</span>
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-1 dark:text-gray-300">Avg. Delivery</div>
              <div className="text-3xl">28 min</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl mb-1">Revenue Overview</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Last 7 days performance</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl mb-1">Orders This Week</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Daily order volume</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl mb-1">Active Orders</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Recent order activity</p>
                </div>
                <button className="text-[#e95322] text-sm hover:underline">View All</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                    <th className="text-left py-4 px-6 text-sm text-gray-600 dark:text-gray-300">Order ID</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600 dark:text-gray-300">Customer</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600 dark:text-gray-300">Restaurant</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600 dark:text-gray-300">Amount</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600 dark:text-gray-300">Status</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600 dark:text-gray-300">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 ${index === recentOrders.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4 px-6 text-sm">{order.id}</td>
                      <td className="py-4 px-6 text-sm">{order.customer}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{order.restaurant}</td>
                      <td className="py-4 px-6 text-sm">${order.amount.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'delivery'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'preparing' && 'Preparing'}
                          {order.status === 'delivery' && 'Out for Delivery'}
                          {order.status === 'delivered' && 'Delivered'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
