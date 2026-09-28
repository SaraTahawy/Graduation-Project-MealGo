import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { DollarSign, Package, Clock, MapPin, Navigation } from 'lucide-react';

interface DriverRequest {
  assignmentId: string;
  orderId: string;
  orderNumber: string;
  restaurant: string;
  restaurantPhone?: string | null;
  customer: string;
  customerPhone?: string | null;
  pickup: string;
  delivery: string;
  items: number;
  total: number;
  paymentMethod: string;
  earnings: number;
  timeout: number;
}

interface ActiveDelivery {
  assignmentId: string;
  orderId: string;
  orderNumber: string;
  restaurant: string;
  restaurantPhone?: string | null;
  customer: string;
  customerPhone?: string | null;
  pickup: string;
  delivery: string;
  items: number;
  total: number;
  paymentMethod: string;
  earnings: number;
  status: 'ready' | 'delivering' | 'delivered' | 'pending' | 'preparing' | 'cancelled';
}

interface DriverDashboardSummary {
  currentEarnings: number;
  activeDeliveries: number;
  pendingRequests: number;
}

export default function DriverDashboard() {
  const [request, setRequest] = useState<DriverRequest | null>(null);
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [summary, setSummary] = useState<DriverDashboardSummary>({
    currentEarnings: 0,
    activeDeliveries: 0,
    pendingRequests: 0,
  });
  const [driverName, setDriverName] = useState('Driver');
  const [driverId, setDriverId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const lastRequestedDriverId = localStorage.getItem('mealgo_last_requested_driver_id');

    if (!storedUser) {
      setDriverId(lastRequestedDriverId || null);
      setIsLoading(false);
      return;
    }
    try {
      const user = JSON.parse(storedUser);
      if (user.role === 'driver') {
        setDriverId(user.driverId || user.id || lastRequestedDriverId || null);
        setDriverName(user.name || 'Driver');
      } else {
        setDriverId(lastRequestedDriverId || null);
      }
    } catch {
      setDriverId(lastRequestedDriverId || null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const syncDriverName = async () => {
      if (!driverId) return;
      const storedUser = localStorage.getItem('currentUser');
      try {
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user?.role === 'driver' && (user.driverId === driverId || user.id === driverId)) {
          setDriverName(user.name || 'Driver');
          return;
        }
      } catch {
        // ignore invalid local user
      }

      try {
        const response = await fetch('/api/drivers/available');
        if (!response.ok) return;
        const data = await response.json();
        const matchedDriver = data.find((item: { id: string; name: string }) => item.id === driverId);
        if (matchedDriver) {
          setDriverName(matchedDriver.name);
        }
      } catch {
        // ignore lookup failure
      }
    };

    syncDriverName();
  }, [driverId]);

  const loadDashboard = async (silent = false) => {
    if (!driverId) {
      setRequest(null);
      setActiveDeliveries([]);
      setSummary({
        currentEarnings: 0,
        activeDeliveries: 0,
        pendingRequests: 0,
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!silent) setIsLoading(true);
      const response = await fetch(`/api/driver/dashboard?driverId=${encodeURIComponent(driverId)}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load driver dashboard');
      }
      setRequest(payload.request || null);
      setActiveDeliveries(payload.activeDeliveries || []);
      setSummary({
        currentEarnings: Number(payload.summary?.currentEarnings || 0),
        activeDeliveries: Number(payload.summary?.activeDeliveries || 0),
        pendingRequests: Number(payload.summary?.pendingRequests || 0),
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [driverId]);

  useEffect(() => {
    if (!driverId) return;
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 2000);
    return () => clearInterval(interval);
  }, [driverId]);

  useEffect(() => {
    if (!request) return;
    const timer = setInterval(() => {
      setRequest((current) => {
        if (!current) return null;
        if (current.timeout <= 1) return null;
        return { ...current, timeout: current.timeout - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [request]);

  const respondToRequest = async (decision: 'accepted' | 'rejected') => {
    if (!request) return;
    try {
      setBusyAction(request.assignmentId);
      const response = await fetch(`/api/driver/assignments/${request.assignmentId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to respond to request');
      }
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setBusyAction(null);
    }
  };

  const getMapSearchLink = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const getDirectionsLink = (origin: string, destination: string) =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

  const markDelivered = async (orderId: string) => {
    if (!driverId) return;
    try {
      setBusyAction(orderId);
      const response = await fetch(`/api/driver/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, status: 'delivered' }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update delivery');
      }
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="driver" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-600 mb-1">Welcome back,</p>
            <h1 className="text-3xl">{driverName}</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-3xl p-8 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-lg opacity-90">Today's Earnings</span>
            </div>
            <div className="text-4xl">${summary.currentEarnings.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#fef2ef] p-3 rounded-xl">
                <Package className="w-6 h-6 text-[#e95322]" />
              </div>
              <span className="text-lg text-gray-700">Active Deliveries</span>
            </div>
            <div className="text-4xl">{summary.activeDeliveries}</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-lg text-gray-700">Pending Requests</span>
            </div>
            <div className="text-4xl">{summary.pendingRequests}</div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {request && (
              <div className="bg-white rounded-3xl shadow-xl border border-orange-200 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-[#e95322] to-[#ff6b35] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl">New Order Request!</h2>
                    <div className="bg-white/20 px-4 py-2 rounded-full text-xl">{request.timeout}s</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Restaurant</div>
                      <div className="text-lg">{request.restaurant}</div>
                      {request.restaurantPhone && (
                        <div className="mt-2 text-sm text-gray-500">{request.restaurantPhone}</div>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Customer</div>
                      <div className="text-lg">{request.customer}</div>
                      <div className="mt-2 text-sm text-gray-500">{request.customerPhone || 'No phone'}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-red-600 mt-1" />
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Pickup Address</div>
                        <div>{request.pickup}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Navigation className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Delivery Address</div>
                        <div>{request.delivery}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Order Total</span>
                      <span className="text-xl">${request.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Your Earnings</span>
                      <span className="text-2xl text-green-600">${request.earnings.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => respondToRequest('rejected')}
                      disabled={busyAction === request.assignmentId}
                      className="flex-1 py-4 border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-lg disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => respondToRequest('accepted')}
                      disabled={busyAction === request.assignmentId}
                      className="flex-1 py-4 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors text-lg disabled:opacity-50"
                    >
                      Accept Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeDeliveries.length === 0 && !request ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
                <p className="text-xl text-gray-600 mb-2">No deliveries yet</p>
                <p className="text-gray-500">When a restaurant assigns you an order, it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((delivery) => (
                  <div key={delivery.assignmentId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl mb-2">{delivery.restaurant}</h3>
                        <p className="text-sm text-gray-600">
                          {delivery.items} items - {delivery.customer} - Order {delivery.orderNumber}
                        </p>
                      </div>
                      <div className="text-2xl text-green-600">${delivery.earnings.toFixed(2)}</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Pickup</div>
                        <div className="text-sm">{delivery.pickup}</div>
                        <div className="mt-2 text-xs text-gray-500">
                          Restaurant phone: {delivery.restaurantPhone || 'No phone'}
                        </div>
                        <div className="mt-3">
                          <a
                            href={getMapSearchLink(delivery.pickup)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full border border-[#ffd7c7] bg-[#fff4ef] px-3 py-2 text-xs text-[#e95322] transition hover:bg-[#ffe4d7]"
                          >
                            Open Pickup In Google Maps
                          </a>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Delivery</div>
                        <div className="text-sm">{delivery.delivery}</div>
                        <div className="mt-2 text-xs text-gray-500">
                          Customer phone: {delivery.customerPhone || 'No phone'}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={getMapSearchLink(delivery.delivery)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full border border-[#ffd7c7] bg-[#fff4ef] px-3 py-2 text-xs text-[#e95322] transition hover:bg-[#ffe4d7]"
                          >
                            Open Delivery In Google Maps
                          </a>
                          <a
                            href={getDirectionsLink(delivery.pickup, delivery.delivery)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-[#e95322] px-3 py-2 text-xs text-white transition hover:bg-[#d14719]"
                          >
                            Directions
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">Payment: {delivery.paymentMethod}</div>
                      <button
                        onClick={() => markDelivered(delivery.orderId)}
                        disabled={busyAction === delivery.orderId}
                        className="bg-[#e95322] text-white px-8 py-3 rounded-full hover:bg-[#d14719] transition-colors disabled:opacity-50"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
