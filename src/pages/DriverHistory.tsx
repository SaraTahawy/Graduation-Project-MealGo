import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ArrowLeft, DollarSign, Package, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getRoleSession, setCurrentUserSession } from '../utils/session';

interface DriverHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  restaurant: string;
  restaurantPhone?: string | null;
  customer: string;
  customerPhone?: string | null;
  pickup: string;
  delivery: string;
  earnings: number;
  status: 'Completed' | 'Rejected' | 'In Progress';
}

export default function DriverHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<DriverHistoryItem[]>([]);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const driverSession = getRoleSession('driver');
    const storedUser = localStorage.getItem('currentUser');
    const lastRequestedDriverId = localStorage.getItem('mealgo_last_requested_driver_id');

    if (driverSession) {
      setCurrentUserSession(driverSession);
      setDriverId(driverSession.driverId || driverSession.id || lastRequestedDriverId || null);
      return;
    }

    if (!storedUser) {
      setDriverId(lastRequestedDriverId || null);
      setIsLoading(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role === 'driver') {
        setDriverId(user.driverId || user.id || lastRequestedDriverId || null);
      } else {
        setDriverId(lastRequestedDriverId || null);
      }
    } catch {
      setDriverId(lastRequestedDriverId || null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      if (!driverId) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/driver/history?driverId=${encodeURIComponent(driverId)}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load history');
        }
        setHistory(payload);
      } catch {
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
    const interval = setInterval(loadHistory, 15000);
    const refreshOnFocus = () => {
      loadHistory();
    };
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [driverId]);

  const totalEarnings = useMemo(
    () => history.filter((item) => item.status === 'Completed').reduce((sum, item) => sum + item.earnings, 0),
    [history]
  );

  const completedDeliveries = history.filter((item) => item.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="driver" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/driver/dashboard')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl">Delivery History</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-3xl p-8 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-lg opacity-90">Total Earned</span>
            </div>
            <div className="text-4xl">${totalEarnings.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#fef2ef] p-3 rounded-xl">
                <Package className="w-6 h-6 text-[#e95322]" />
              </div>
              <span className="text-lg text-gray-700">Completed Deliveries</span>
            </div>
            <div className="text-4xl">{completedDeliveries}</div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-xl text-gray-500 mb-2">No delivery history yet</p>
            <p className="text-gray-400">Accepted and rejected requests will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#e95322]">{delivery.orderNumber}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          delivery.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : delivery.status === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <h3 className="text-lg mb-1">{delivery.restaurant}</h3>
                    <p className="text-sm text-gray-600">Customer: {delivery.customer}</p>
                    <p className="text-sm text-gray-500">Restaurant phone: {delivery.restaurantPhone || 'No phone'}</p>
                    <p className="text-sm text-gray-500">Customer phone: {delivery.customerPhone || 'No phone'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl text-green-600 mb-1">${delivery.earnings.toFixed(2)}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(delivery.date).toLocaleString('en-US')}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg mt-1">
                      <MapPin className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Pickup</div>
                      <div className="text-sm">{delivery.pickup}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg mt-1">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Delivery</div>
                      <div className="text-sm">{delivery.delivery}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
