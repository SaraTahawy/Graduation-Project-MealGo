import { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 1200 },
  { month: 'Feb', revenue: 52000, orders: 1450 },
  { month: 'Mar', revenue: 48000, orders: 1350 },
  { month: 'Apr', revenue: 61000, orders: 1680 },
  { month: 'May', revenue: 78000, orders: 2100 },
  { month: 'Jun', revenue: 82000, orders: 2280 },
];

const categoryData = [
  { name: 'Pizza', value: 35, color: '#e95322' },
  { name: 'Burgers', value: 25, color: '#ff6b35' },
  { name: 'Sushi', value: 20, color: '#10b981' },
  { name: 'Italian', value: 12, color: '#3b82f6' },
  { name: 'Others', value: 8, color: '#8b5cf6' },
];

const topRestaurants = [
  { name: 'Pizza Paradise', orders: 1485, revenue: 45231, growth: 12.5 },
  { name: 'Burger House', orders: 1234, revenue: 38450, growth: 8.3 },
  { name: 'Tokyo Sushi', orders: 987, revenue: 32450, growth: 15.2 },
  { name: 'Italian Bistro', orders: 876, revenue: 28750, growth: -3.2 },
  { name: 'Starbucks', orders: 2340, revenue: 85120, growth: 22.1 },
];

const topDrivers = [
  { name: 'John Driver', deliveries: 234, earnings: 2540, rating: 4.8 },
  { name: 'Mike Rider', deliveries: 189, earnings: 1890, rating: 4.9 },
  { name: 'Sarah Delivery', deliveries: 156, earnings: 1650, rating: 4.7 },
  { name: 'Tom Wilson', deliveries: 145, earnings: 1520, rating: 4.6 },
  { name: 'Lisa Transport', deliveries: 132, earnings: 1380, rating: 4.8 },
];

const summaryMetrics = [
  { label: 'Total Revenue', value: '$366,000', trend: '+15.3% from last period' },
  { label: 'Total Orders', value: '10,060', trend: '+12.1% from last period' },
  { label: 'Average Order Value', value: '$36.40', trend: '-2.4% from last period' },
  { label: 'Customer Satisfaction', value: '4.7/5.0', trend: '+0.3 from last period' },
];

const escapeCsvValue = (value: string | number) => {
  const normalizedValue = String(value).replace(/"/g, '""');
  return `"${normalizedValue}"`;
};

export default function AdminReports() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);

    try {
      const sections = [
        ['Reports & Analytics Export'],
        ['Period', 'Last 6 Months'],
        [],
        ['Summary Metrics'],
        ['Metric', 'Value', 'Trend'],
        ...summaryMetrics.map((metric) => [metric.label, metric.value, metric.trend]),
        [],
        ['Revenue Trend'],
        ['Month', 'Revenue', 'Orders'],
        ...revenueData.map((item) => [item.month, item.revenue, item.orders]),
        [],
        ['Category Distribution'],
        ['Category', 'Share %'],
        ...categoryData.map((item) => [item.name, item.value]),
        [],
        ['Top Restaurants'],
        ['Restaurant', 'Orders', 'Revenue', 'Growth %'],
        ...topRestaurants.map((item) => [item.name, item.orders, item.revenue, item.growth]),
        [],
        ['Top Drivers'],
        ['Driver', 'Deliveries', 'Earnings', 'Rating'],
        ...topDrivers.map((item) => [item.name, item.deliveries, item.earnings, item.rating]),
      ];

      const csvContent = sections
        .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `admin-reports-last-6-months-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-1">Reports & Analytics</h1>
              <p className="text-gray-600">Performance insights and statistics</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Last 6 Months
              </button>
              <button
                type="button"
                onClick={handleExportReport}
                disabled={isExporting}
                className="px-6 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Download className="w-5 h-5" />
                {isExporting ? 'Exporting...' : 'Export Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
              <div className="text-3xl mb-2">$366,000</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+15.3% from last period</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Orders</div>
              <div className="text-3xl mb-2">10,060</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.1% from last period</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Average Order Value</div>
              <div className="text-3xl mb-2">$36.40</div>
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-2.4% from last period</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Customer Satisfaction</div>
              <div className="text-3xl mb-2">4.7/5.0</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+0.3 from last period</span>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl mb-1">Revenue Trend</h2>
                <p className="text-sm text-gray-600">Monthly revenue performance</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Trend */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl mb-1">Orders Volume</h2>
                <p className="text-sm text-gray-600">Monthly order count</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#e95322" radius={[8, 8, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl mb-1">Category Distribution</h2>
                <p className="text-sm text-gray-600">Orders by food category</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Restaurants */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl mb-1">Top Performing Restaurants</h2>
                <p className="text-sm text-gray-600">Best restaurants by revenue</p>
              </div>
              <div className="space-y-3">
                {topRestaurants.map((restaurant, index) => (
                  <div key={restaurant.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-full flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm mb-1">{restaurant.name}</div>
                      <div className="text-xs text-gray-500">{restaurant.orders} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm mb-1">${restaurant.revenue.toLocaleString()}</div>
                      <div className={`text-xs flex items-center gap-1 ${restaurant.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {restaurant.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(restaurant.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Drivers */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl mb-1">Top Performing Drivers</h2>
              <p className="text-sm text-gray-600">Best drivers by deliveries</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Rank</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Driver</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Deliveries</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Earnings</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topDrivers.map((driver, index) => (
                    <tr key={driver.name} className={`border-b border-gray-100 ${index === topDrivers.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-full flex items-center justify-center text-white text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm">{driver.name}</td>
                      <td className="py-4 px-6 text-sm">{driver.deliveries}</td>
                      <td className="py-4 px-6 text-sm text-green-600">${driver.earnings}</td>
                      <td className="py-4 px-6 text-sm">⭐ {driver.rating}</td>
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
