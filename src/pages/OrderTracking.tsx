import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChefHat, ArrowLeft, Star, Phone, MapPin, Clock as ClockIcon } from 'lucide-react';
import { getRoleSession } from '../utils/session';

type TrackingStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

interface TrackingHistoryItem {
  status: TrackingStatus;
  createdAt: string;
}

interface TrackingOrder {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  restaurantId?: string | null;
  status: TrackingStatus;
  total: number;
  items: number;
  orderTime: string;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  deliveryAddress: string;
  deliveryCity?: string | null;
  deliveryNotes?: string | null;
  paymentMethod: string;
  restaurant: string;
  driver?: string | null;
  driverPhone?: string | null;
  driverVehicleType?: string | null;
  history: TrackingHistoryItem[];
}

const statusSteps: Array<{ key: TrackingStatus; label: string }> = [
  { key: 'pending', label: 'Order Received' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivering', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { orderNumber?: string }) || {};
  const customerSession = getRoleSession('customer');
  const userId = customerSession?.id || null;
  const searchOrderNumber = new URLSearchParams(location.search).get('orderNumber');
  const fallbackOrderNumber = (userId && localStorage.getItem(`mealgo_last_order_number_${userId}`))
    || localStorage.getItem('mealgo_last_order_number');
  const orderNumber = locationState.orderNumber || searchOrderNumber || fallbackOrderNumber;

  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSaved, setReviewSaved] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrder = async (silent = false) => {
      if (!orderNumber) {
        setOrder(null);
        setIsLoading(false);
        return;
      }

      try {
        if (!silent) setIsLoading(true);
        const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`);
        if (!response.ok) {
          const storageKey = `mealgo_orders_${userId || 'guest'}`;
          const storedOrders = localStorage.getItem(storageKey);
          const localOrders = storedOrders ? JSON.parse(storedOrders) : [];
          const localOrder = localOrders.find((item: any) => item.orderNumber === orderNumber);
          if (localOrder) {
            setOrder({
              id: localOrder.id,
              orderNumber: localOrder.orderNumber,
              status: localOrder.status === 'in-progress' ? 'preparing' : localOrder.status,
              total: Number(localOrder.total || 0),
              items: Number(localOrder.items || 0),
              orderTime: localOrder.date || new Date().toISOString(),
              estimatedDelivery: null,
              deliveredAt: null,
              cancelledAt: null,
              deliveryAddress: localOrder.deliveryAddress || 'Unknown address',
              deliveryCity: 'Unknown City',
              deliveryNotes: null,
              paymentMethod: localOrder.paymentMethod || 'card',
              restaurant: localOrder.restaurant || 'Restaurant',
              driver: null,
              driverPhone: null,
              driverVehicleType: null,
              history: [
                {
                  status: localOrder.status === 'pending' ? 'pending' : 'preparing',
                  createdAt: localOrder.date || new Date().toISOString(),
                },
              ],
            });
          } else {
            setOrder(null);
          }
          return;
        }
        const data = await response.json();
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        if (!silent) setIsLoading(false);
      }
    };

    fetchOrder();

    const interval = setInterval(() => {
      fetchOrder(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [orderNumber]);

  useEffect(() => {
    const fetchReview = async () => {
      if (!order?.id || !userId) return;

      try {
        const response = await fetch(`/api/orders/${order.id}/review?customerId=${encodeURIComponent(userId)}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.review) {
          setReviewSaved(false);
          setReviewMessage(null);
          return;
        }

        setReviewRating(Number(payload.review.rating || 0));
        setReviewComment(payload.review.comment || '');
        setReviewSaved(true);
        setReviewMessage(null);
      } catch {
        setReviewSaved(false);
        setReviewMessage(null);
      }
    };

    fetchReview();
  }, [order?.id, userId]);

  const handleSubmitReview = async () => {
    if (!order?.id || !userId) return;
    if (reviewRating < 1 || reviewRating > 5) {
      setReviewMessage('Please choose a rating first.');
      return;
    }

    try {
      setIsSavingReview(true);
      setReviewMessage(null);
      const response = await fetch(`/api/orders/${order.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: userId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to save review');
      }
      setReviewSaved(true);
      setReviewMessage('Thanks for your feedback.');
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : 'Failed to save review');
    } finally {
      setIsSavingReview(false);
    }
  };

  const currentStatusIndex = useMemo(() => {
    if (!order) return 0;
    const index = statusSteps.findIndex((step) => step.key === order.status);
    if (index >= 0) return index;
    if (order.status === 'cancelled') return 0;
    return 0;
  }, [order]);

  const statusesWithTime = useMemo(() => {
    if (!order) return [];

    return statusSteps.map((step, index) => {
      const historyItem = order.history.find((item) => item.status === step.key);
      let timeLabel = historyItem?.createdAt
        ? new Date(historyItem.createdAt).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
        : undefined;

      if (!timeLabel && index > currentStatusIndex) {
        timeLabel = order.estimatedDelivery
          ? `Est. ${new Date(order.estimatedDelivery).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
          : 'Est. 25-35 min';
      }

      return {
        ...step,
        time: timeLabel || 'Waiting',
      };
    });
  }, [order, currentStatusIndex]);

  const estimatedArrival = order?.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '25-35 min';
  const deliveryMapLink = order
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [order.deliveryAddress, order.deliveryCity].filter(Boolean).join(', ')
      )}`
    : '';

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#e95322] rounded-xl p-2">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">MealGo</span>
            </div>
            <button
              onClick={() => navigate('/order')}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-[#e95322] hover:text-[#e95322]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-600">Loading order tracking...</p>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-2xl font-semibold mb-4">Order not found</div>
            <p className="text-gray-600 mb-6">
              We couldn't find an order with this number. Check your order history or place a new order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="w-full sm:w-auto bg-[#e95322] text-white py-3 px-6 rounded-xl hover:bg-[#d14719] transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/order')}
                className="w-full sm:w-auto border border-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Place New Order
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">Tracking Order</div>
              <h1 className="text-3xl">{order.orderNumber}</h1>
              <div className="text-sm text-gray-500">
                {new Date(order.orderTime).toLocaleDateString('en-US')}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#e95322] rounded-full flex items-center justify-center text-white text-xl">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Restaurant</div>
                    <div className="text-lg">{order.restaurant}</div>
                    <div className="text-sm text-gray-600">{order.items} items</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Total Order Price</div>
                  <div className="text-2xl text-[#e95322]">${order.total.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#e95322] to-[#ff6b35] rounded-2xl p-8 text-white text-center mb-6">
              <div className="text-sm opacity-90 mb-2">Current Status</div>
              <div className="text-4xl mb-2">
                {order.status === 'cancelled'
                  ? 'Cancelled'
                  : statusSteps.find((step) => step.key === order.status)?.label || 'Order Received'}
              </div>
              <div className="text-sm opacity-90">
                {order.status === 'delivered'
                  ? 'Your order has been delivered.'
                  : order.status === 'cancelled'
                    ? 'This order was cancelled.'
                    : `Estimated arrival ${estimatedArrival}`}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-lg mb-6">Order Status</h3>

              <div className="relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />
                {order.status !== 'cancelled' && (
                  <div
                    className="absolute left-6 top-6 w-0.5 bg-[#e95322] transition-all duration-500"
                    style={{ height: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                )}

                <div className="relative space-y-8">
                  {statusesWithTime.map((status, index) => (
                    <div key={status.key} className="flex items-start gap-4">
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        index <= currentStatusIndex && order.status !== 'cancelled' ? 'bg-[#e95322]' : 'bg-gray-200'
                      }`}>
                        <div className={`w-6 h-6 rounded-full ${
                          index <= currentStatusIndex && order.status !== 'cancelled' ? 'bg-white' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="text-base mb-1">{status.label}</div>
                        <div className="text-sm text-gray-600">{status.time}</div>
                        {index === currentStatusIndex && order.status !== 'cancelled' && (
                          <div className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                            In Progress
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {order.status === 'cancelled' && (
                    <div className="flex items-start gap-4">
                      <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-red-500">
                        <div className="w-6 h-6 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="text-base mb-1 text-red-600">Cancelled</div>
                        <div className="text-sm text-gray-600">
                          {order.cancelledAt
                            ? new Date(order.cancelledAt).toLocaleString('en-US')
                            : 'Cancelled by restaurant'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="relative h-64 bg-[radial-gradient(circle_at_top,#fde7dd,transparent_45%),linear-gradient(135deg,#eef6ff,#e9f7ef)] p-6">
                <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-full shadow-md flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#e95322]" />
                  Google Maps
                </div>
                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <div className="text-center text-gray-700 max-w-sm">
                    <MapPin className="w-12 h-12 text-[#e95322] mx-auto mb-3" />
                    <p className="text-base mb-2">Open your delivery location in Google Maps</p>
                    <p className="text-xs text-gray-500 mb-4">You can view the address directly on the map.</p>
                    <a
                      href={deliveryMapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#e95322] px-5 py-3 text-sm text-white transition hover:bg-[#d14719]"
                    >
                      Open Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-lg mb-4">Your Delivery Partner</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-full flex items-center justify-center text-white text-2xl">
                    {order.driver ? order.driver.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <div className="text-base mb-1">{order.driver || 'Driver not assigned yet'}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{order.driver ? '4.9' : 'Waiting'}</span>
                    </div>
                    {order.driverVehicleType && (
                      <div className="mt-1 text-sm text-gray-500">{order.driverVehicleType}</div>
                    )}
                    <div className="mt-1 text-sm text-gray-700">
                      Driver phone: {order.driverPhone || 'Phone unavailable'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => order.driverPhone && window.open(`tel:${order.driverPhone}`)}
                    disabled={!order.driverPhone}
                    className="w-12 h-12 bg-[#fef2ef] rounded-full flex items-center justify-center hover:bg-[#ffdecf] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Phone className="w-5 h-5 text-[#e95322]" />
                  </button>
                </div>
              </div>
            </div>

            {order.status === 'delivered' && (!order.customerId || order.customerId === userId) && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg">Rate This Restaurant</h3>
                    <p className="text-sm text-gray-600">Your rating updates the restaurant score and feedback.</p>
                  </div>
                  {reviewSaved && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                      Saved
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setReviewRating(value)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          value <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write feedback for the restaurant..."
                  className="w-full min-h-[120px] rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#e95322]"
                />

                {reviewMessage && (
                  <div className={`mt-4 text-sm ${reviewMessage.includes('Thanks') ? 'text-green-600' : 'text-red-600'}`}>
                    {reviewMessage}
                  </div>
                )}

                <button
                  onClick={handleSubmitReview}
                  disabled={isSavingReview}
                  className="mt-4 rounded-xl bg-[#e95322] px-5 py-3 text-white transition hover:bg-[#d14719] disabled:opacity-70"
                >
                  {isSavingReview ? 'Saving...' : reviewSaved ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg mb-4">Delivery Details</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#fef2ef] rounded-full flex items-center justify-center mt-1">
                    <MapPin className="w-5 h-5 text-[#e95322]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Delivery Address</div>
                    <div className="mb-1">{order.deliveryAddress}</div>
                    <div className="text-sm text-gray-600">{order.deliveryCity || 'Unknown City'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#fef2ef] rounded-full flex items-center justify-center mt-1">
                    <ClockIcon className="w-5 h-5 text-[#e95322]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Delivery Instructions</div>
                    <div className="text-sm">{order.deliveryNotes || 'No special instructions'}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
