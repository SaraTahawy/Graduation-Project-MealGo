import { useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Filter, Download, Eye, MapPin, Clock, DollarSign, User } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  restaurant: string;
  driver: string | null;
  items: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryAddress: string;
  orderTime: string;
  estimatedDelivery: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2451',
    customer: 'Ahmad Ali',
    customerEmail: 'ahmad@example.com',
    restaurant: 'Pizza Paradise',
    driver: 'John Driver',
    items: 3,
    total: 24.50,
    status: 'preparing',
    paymentMethod: 'Credit Card',
    deliveryAddress: 'Jl. Sudirman 123, Jakarta',
    orderTime: '2:30 PM',
    estimatedDelivery: '3:00 PM'
  },
  {
    id: '2',
    orderNumber: 'ORD-2450',
    customer: 'Sarah Khan',
    customerEmail: 'sarah@example.com',
    restaurant: 'Burger House',
    driver: 'Mike Driver',
    items: 2,
    total: 18.99,
    status: 'delivering',
    paymentMethod: 'Cash',
    deliveryAddress: 'Jl. Thamrin 45, Jakarta',
    orderTime: '2:15 PM',
    estimatedDelivery: '2:45 PM'
  },
  {
    id: '3',
    orderNumber: 'ORD-2449',
    customer: 'Mike Brown',
    customerEmail: 'mike@example.com',
    restaurant: 'Tokyo Sushi',
    driver: null,
    items: 5,
    total: 32.50,
    status: 'ready',
    paymentMethod: 'Digital Wallet',
    deliveryAddress: 'Jl. Gatot Subroto 89, Jakarta',
    orderTime: '2:00 PM',
    estimatedDelivery: '2:30 PM'
  },
  {
    id: '4',
    orderNumber: 'ORD-2448',
    customer: 'Lisa Wong',
    customerEmail: 'lisa@example.com',
    restaurant: 'Italian Bistro',
    driver: 'John Driver',
    items: 4,
    total: 28.75,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    deliveryAddress: 'Jl. Rasuna Said 12, Jakarta',
    orderTime: '1:00 PM',
    estimatedDelivery: '1:30 PM'
  },
  {
    id: '5',
    orderNumber: 'ORD-2447',
    customer: 'John Doe',
    customerEmail: 'john@example.com',
    restaurant: 'Pizza Paradise',
    driver: 'Tom Driver',
    items: 6,
    total: 45.20,
    status: 'delivered',
    paymentMethod: 'Cash',
    deliveryAddress: 'Jl. Kuningan 78, Jakarta',
    orderTime: '12:30 PM',
    estimatedDelivery: '1:00 PM'
  },
  {
    id: '6',
    orderNumber: 'ORD-2446',
    customer: 'Emma Davis',
    customerEmail: 'emma@example.com',
    restaurant: 'Burger House',
    driver: null,
    items: 1,
    total: 12.50,
    status: 'cancelled',
    paymentMethod: 'Credit Card',
    deliveryAddress: 'Jl. Menteng 34, Jakarta',
    orderTime: '12:00 PM',
    estimatedDelivery: '12:30 PM'
  }
];

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('status', statusFilter);
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchOrders, 250);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }), [orders]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-purple-100 text-purple-700';
      case 'delivering': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-1">Orders Management</h1>
              <p className="text-gray-600">Monitor and manage all orders</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 border-2 border-[#e95322] text-[#e95322] rounded-xl hover:bg-[#fef2ef] transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Total</div>
              <div className="text-2xl">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Pending</div>
              <div className="text-2xl text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Preparing</div>
              <div className="text-2xl text-blue-600">{stats.preparing}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Delivering</div>
              <div className="text-2xl text-orange-600">{stats.delivering}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Delivered</div>
              <div className="text-2xl text-green-600">{stats.delivered}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Cancelled</div>
              <div className="text-2xl text-red-600">{stats.cancelled}</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders by ID, customer, or restaurant..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                />
              </div>
              <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'pending', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? 'bg-[#e95322] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 mb-6">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Order ID</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Customer</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Restaurant</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Driver</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Items</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Total</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Time</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index === orders.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4 px-6 text-sm">{order.orderNumber}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm">{order.customer}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="py-4 px-6 text-sm">{order.restaurant}</td>
                      <td className="py-4 px-6 text-sm">{order.driver || <span className="text-gray-400">Unassigned</span>}</td>
                      <td className="py-4 px-6 text-sm">{order.items}</td>
                      <td className="py-4 px-6 text-sm">${order.total.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{formatDateTime(order.orderTime)}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!isLoading && orders.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Order Number</div>
                    <div className="text-xl text-[#e95322]">{selectedOrder.orderNumber}</div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <div className="text-sm text-gray-600">Customer</div>
                    </div>
                    <div className="text-sm">{selectedOrder.customer}</div>
                    <div className="text-xs text-gray-500">{selectedOrder.customerEmail}</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div className="text-sm text-gray-600">Time</div>
                    </div>
                    <div className="text-sm">Ordered: {formatDateTime(selectedOrder.orderTime)}</div>
                    <div className="text-xs text-gray-500">ETA: {selectedOrder.estimatedDelivery ? formatDateTime(selectedOrder.estimatedDelivery) : '-'}</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <div className="text-sm text-gray-600">Delivery Address</div>
                    </div>
                    <div className="text-sm">{selectedOrder.deliveryAddress}</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <div className="text-sm text-gray-600">Payment</div>
                    </div>
                    <div className="text-sm">{selectedOrder.paymentMethod}</div>
                    <div className="text-xs text-gray-500">Total: ${selectedOrder.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Restaurant & Driver */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Restaurant</div>
                    <div className="text-base">{selectedOrder.restaurant}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Driver</div>
                    <div className="text-base">{selectedOrder.driver || <span className="text-gray-400">Not assigned</span>}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
