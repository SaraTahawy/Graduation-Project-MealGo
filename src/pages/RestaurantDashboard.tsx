import { Navbar } from '../components/Navbar';
import { DollarSign, ShoppingBag, TrendingUp, Clock, Bell, Star } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { hydrateRoleSession, setCurrentUserSession } from '../utils/session';

const revenueData = [
  { day: 'Mon', value: 5000 },
  { day: 'Tue', value: 5500 },
  { day: 'Wed', value: 6200 },
  { day: 'Thu', value: 6800 },
  { day: 'Fri', value: 7500 },
  { day: 'Sat', value: 8200 },
  { day: 'Sun', value: 7800 },
];

const ordersData = [
  { day: 'Mon', orders: 58 },
  { day: 'Tue', orders: 62 },
  { day: 'Wed', orders: 68 },
  { day: 'Thu', orders: 78 },
  { day: 'Fri', orders: 95 },
  { day: 'Sat', orders: 112 },
  { day: 'Sun', orders: 89 },
];

const activeOrders = [
  {
    id: '#ORD-2451',
    customer: 'Ahmed Ali',
    items: 3,
    time: '15 min ago',
    status: 'Preparing',
    amount: '$24.50',
  },
  {
    id: '#ORD-2452',
    customer: 'Sarah Johnson',
    items: 2,
    time: '8 min ago',
    status: 'Out for Delivery',
    amount: '$32.90',
  },
  {
    id: '#ORD-2453',
    customer: 'Mike Brown',
    items: 5,
    time: '5 min ago',
    status: 'Pending',
    amount: '$45.20',
  },
];

const fallbackRestaurantName = 'Your Restaurant';
const fallbackRestaurantId = '77777777-7777-7777-7777-777777777771';

interface ReviewItem {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function RestaurantDashboard() {
  const [restaurantName, setRestaurantName] = useState(fallbackRestaurantName);
  const [restaurantId, setRestaurantId] = useState(fallbackRestaurantId);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadRestaurantSession = async () => {
      const user = await hydrateRoleSession('restaurant');
      if (!isMounted) return;

      if (!user) {
        setRestaurantName(fallbackRestaurantName);
        setRestaurantId(fallbackRestaurantId);
        return;
      }

      try {
        setRestaurantId(user.restaurantId || fallbackRestaurantId);
        if (user.restaurantName) {
          setCurrentUserSession(user);
          setRestaurantName(user.restaurantName);
          return;
        }

        try {
          if (user.email && user.role) {
            const authResponse = await fetch('/api/auth/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email, role: user.role }),
            });

            if (authResponse.ok) {
              const authUser = await authResponse.json();
              if (authUser.restaurantName) {
                setRestaurantName(authUser.restaurantName);
                setCurrentUserSession({
                  ...user,
                  restaurantId: authUser.restaurantId ?? user.restaurantId ?? null,
                  restaurantName: authUser.restaurantName,
                });
                return;
              }
            }
          }

          const response = await fetch('/api/restaurants');
          if (!response.ok) {
            setRestaurantName(fallbackRestaurantName);
            return;
          }

          const restaurants = await response.json();
          const matchedRestaurant = restaurants.find((restaurant: { id: string; name: string; email?: string }) => {
            if (user.restaurantId && restaurant.id === user.restaurantId) return true;
            if (user.email && restaurant.email && restaurant.email.toLowerCase() === String(user.email).toLowerCase()) return true;
            return false;
          });
          setRestaurantName(matchedRestaurant?.name || fallbackRestaurantName);
        } catch {
          setRestaurantName(fallbackRestaurantName);
        }
      } catch {
        setRestaurantName(fallbackRestaurantName);
      }
    };

    loadRestaurantSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/reviews`);
        if (!response.ok) return;
        const data = await response.json();
        setReviews(data);
      } catch {
        setReviews([]);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="restaurant" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-600 mb-1">Welcome back,</p>
            <h1 className="text-3xl">{restaurantName}</h1>
          </div>
          <button className="relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-3xl p-8 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-lg opacity-90">Total Revenue</span>
            </div>
            <div className="text-4xl mb-2">$45,231</div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#fef2ef] p-3 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-[#e95322]" />
              </div>
              <span className="text-lg text-gray-700">Total Orders</span>
            </div>
            <div className="text-4xl mb-2">1,465</div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8.3%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl mb-6">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#e95322"
                  strokeWidth={2}
                  dot={{ fill: '#e95322', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl mb-6">Orders This Week</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#e95322" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Active Orders</h2>
            <button className="text-[#e95322] hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-[#e95322] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#fef2ef] w-12 h-12 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-[#e95322]" />
                  </div>
                  <div>
                    <div className="text-[#e95322] mb-1">{order.id}</div>
                    <div className="text-sm text-gray-600">
                      {order.customer} • {order.items} items
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3" />
                      {order.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm ${
                      order.status === 'Preparing'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'Out for Delivery'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                  <div className="text-lg min-w-[80px] text-right">{order.amount}</div>
                  <button className="text-[#e95322] hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl">Customer Feedback</h2>
              <p className="text-sm text-gray-500">Latest restaurant ratings and comments</p>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-base">{review.customer}</div>
                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={`${review.id}-${index}`}
                            className={`w-4 h-4 ${
                              index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US')}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">{review.comment || 'No written feedback'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No feedback yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
