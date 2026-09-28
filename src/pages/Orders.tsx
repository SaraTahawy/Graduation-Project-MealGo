import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Clock, Package, CheckCircle, XCircle, Eye, MapPin } from 'lucide-react';
import { getRoleSession } from '../utils/session';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  restaurant: string;
  items: number;
  total: number;
  status: 'delivered' | 'cancelled' | 'in-progress' | 'pending';
  deliveryAddress: string;
  estimatedTime?: string;
}

type TrackingStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

interface TrackingOrderResponse {
  id: string;
  orderNumber: string;
  status: TrackingStatus;
  total: number;
  items: number;
  orderTime: string;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  deliveryAddress: string;
  restaurant: string;
}

const toOrderStatus = (status: TrackingStatus): Order['status'] => {
  if (status === 'delivered') return 'delivered';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'pending') return 'pending';
  return 'in-progress';
};

const formatEstimatedTime = (estimatedDelivery?: string | null) => {
  if (!estimatedDelivery) return '25-35 min';

  const diffMs = new Date(estimatedDelivery).getTime() - Date.now();
  if (Number.isNaN(diffMs) || diffMs <= 0) return 'Soon';

  const minutes = Math.max(1, Math.round(diffMs / 60000));
  return `${minutes} min`;
};

// Orders are stored in localStorage per user (so first visit is empty, then history appears after placing an order)
// Key format: mealgo_orders_<userId> (or mealgo_orders_guest)

export default function Orders() {
  const navigate = useNavigate();
  const customerSession = getRoleSession('customer');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const userId = customerSession?.id || 'guest';
    const storageKey = `mealgo_orders_${userId}`;

    const loadOrders = async (silent = false) => {
      const storageKey = `mealgo_orders_${userId}`;
      const storedOrders = localStorage.getItem(storageKey);
      const localOrders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];

      if (!silent) {
        setOrders(localOrders);
      }

      if (localOrders.length === 0) {
        return;
      }

      try {
        const refreshedOrders = await Promise.all(
          localOrders.map(async (order) => {
            try {
              const response = await fetch(`/api/orders/${encodeURIComponent(order.orderNumber)}`);
              if (!response.ok) {
                return order;
              }

              const payload: TrackingOrderResponse = await response.json();
              return {
                ...order,
                id: payload.id || order.id,
                restaurant: payload.restaurant || order.restaurant,
                items: Number(payload.items || order.items),
                total: Number(payload.total || order.total),
                status: toOrderStatus(payload.status),
                date: payload.orderTime
                  ? new Date(payload.orderTime).toLocaleDateString()
                  : order.date,
                deliveryAddress: payload.deliveryAddress || order.deliveryAddress,
                estimatedTime:
                  payload.status === 'delivered' || payload.status === 'cancelled'
                    ? undefined
                    : formatEstimatedTime(payload.estimatedDelivery),
              };
            } catch {
              return order;
            }
          })
        );

        setOrders(refreshedOrders);
        localStorage.setItem(storageKey, JSON.stringify(refreshedOrders));
      } catch {
        setOrders(localOrders);
      }
    };

    loadOrders();
    window.addEventListener('storage', loadOrders);

    const interval = setInterval(() => {
      loadOrders(true);
    }, 5000);

    return () => {
      window.removeEventListener('storage', loadOrders);
      clearInterval(interval);
    };
  }, [customerSession?.id]);

  const filteredOrders = orders
    .filter((order) =>
      statusFilter === 'all' ? true : order.status === statusFilter
    )
    .filter((order) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.restaurant.toLowerCase().includes(q) ||
        order.deliveryAddress.toLowerCase().includes(q)
      );
    });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-orange-100 text-orange-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'in-progress':
        return <Clock className="w-5 h-5" />;
      case 'pending':
        return <Package className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'delivered':
        return 'Delivered';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">My Orders</h1>
          <p className="text-xl text-gray-600">View and track your orders</p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#e95322]"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {['all', 'in-progress', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? 'bg-[#e95322] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl">{order.restaurant}</h3>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Order {order.orderNumber}</span>
                    <span>â€¢</span>
                    <span>{order.date}</span>
                    <span>â€¢</span>
                    <span>{order.items} items</span>
                  </div>
                  {order.estimatedTime && order.status === 'in-progress' && (
                    <div className="mt-2 flex items-center gap-2 text-[#e95322]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Arrives in {order.estimatedTime}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl text-[#e95322] mb-2">${order.total.toFixed(2)}</div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-[#e95322] hover:underline text-sm flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

              {order.status === 'in-progress' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/order-tracking?orderNumber=${encodeURIComponent(order.orderNumber)}`, { state: { orderNumber: order.orderNumber } })}
                    className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors"
                  >
                    Track Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No orders found</p>
            <p className="text-gray-400">Start ordering from your favorite restaurants!</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl mb-1">Order Details</h2>
                  <p className="text-gray-600">Order {selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  âœ•
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Restaurant</div>
                  <div className="text-base">{selectedOrder.restaurant}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Order Date</div>
                  <div className="text-base">{selectedOrder.date}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                  <div className="text-xl text-[#e95322]">${selectedOrder.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-[#e95322] mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Delivery Address</div>
                    <div className="text-base">{selectedOrder.deliveryAddress}</div>
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'in-progress' && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    navigate(`/order-tracking?orderNumber=${encodeURIComponent(selectedOrder.orderNumber)}`, { state: { orderNumber: selectedOrder.orderNumber } });
                  }}
                  className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors"
                >
                  Track Order
                </button>
              )}

              {selectedOrder.status === 'delivered' && (
                <button
                  onClick={() => navigate('/order')}
                  className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors"
                >
                  Reorder
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
