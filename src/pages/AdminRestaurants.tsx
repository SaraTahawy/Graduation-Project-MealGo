import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Plus, MapPin, Star, Edit, Trash2, Check, X } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  image?: string;
  address: string;
  orders: number;
  revenue: number;
  rating: number | null;
  status: 'active' | 'inactive' | 'pending';
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Gramercy Tavern',
    owner: 'John Smith',
    email: 'john@gramercy.com',
    phone: '+1 234 567 8901',
    address: 'Jl. Sudirman 123, Jakarta',
    orders: 1485,
    revenue: 45231,
    rating: 4.8,
    status: 'active'
  },
  {
    id: '2',
    name: 'Starbucks Borobudur',
    owner: 'Sarah Johnson',
    email: 'sarah@starbucks.com',
    phone: '+1 234 567 8902',
    address: 'Jl. Gajah Mada 45, Jakarta',
    orders: 2340,
    revenue: 85120,
    rating: 4.9,
    status: 'active'
  },
  {
    id: '3',
    name: 'Baegopa Suhat',
    owner: 'Mike Brown',
    email: 'mike@baegopa.com',
    phone: '+1 234 567 8903',
    address: 'Jl. Thamrin 85, Jakarta',
    orders: 987,
    revenue: 32450,
    rating: 4.7,
    status: 'active'
  },
  {
    id: '4',
    name: 'New Pizza Place',
    owner: 'Emily Davis',
    email: 'emily@pizza.com',
    phone: '+1 234 567 8904',
    address: 'Jl. Veteran 23, Jakarta',
    orders: 0,
    revenue: 0,
    rating: null,
    status: 'pending'
  },
  {
    id: '5',
    name: 'Old Burger Joint',
    owner: 'Tom Wilson',
    email: 'tom@burger.com',
    phone: '+1 234 567 8905',
    address: 'Jl. Merdeka 89, Jakarta',
    orders: 456,
    revenue: 12340,
    rating: 4.2,
    status: 'inactive'
  }
];

export default function AdminRestaurants() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('status', statusFilter);
      const response = await fetch(`/api/admin/restaurants?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };
  const isValidGmail = (email: string) => /^[^\s@]+@gmail\.com$/i.test(email);
  const isValidPhone = (phone: string) => /^\+?[0-9\s-]{8,20}$/.test(phone.trim());
  const getErrorMessage = async (response: Response) => {
    try {
      const body = await response.json();
      return body?.message || 'Request failed';
    } catch {
      return 'Request failed';
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchRestaurants, 250);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: restaurants.length,
    active: restaurants.filter(r => r.status === 'active').length,
    inactive: restaurants.filter(r => r.status === 'inactive').length,
    pending: restaurants.filter(r => r.status === 'pending').length
  }), [restaurants]);

  const handleApprove = async (id: string) => {
    const response = await fetch(`/api/admin/restaurants/${id}/approve`, { method: 'PATCH' });
    if (!response.ok) {
      alert('Failed to approve restaurant');
      return;
    }
    fetchRestaurants();
  };

  const handleReject = async (id: string) => {
    if (confirm('Are you sure you want to reject this restaurant?')) {
      const response = await fetch(`/api/admin/restaurants/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        alert('Failed to reject restaurant');
        return;
      }
      fetchRestaurants();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      const response = await fetch(`/api/admin/restaurants/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        alert('Failed to delete restaurant');
        return;
      }
      fetchRestaurants();
    }
  };

  const handleEditImage = async (restaurant: Restaurant) => {
    const imageUrl = prompt('Restaurant image URL', restaurant.image || '');
    if (imageUrl === null) return;

    const response = await fetch(`/api/admin/restaurants/${restaurant.id}/image`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      alert('Failed to update restaurant image');
      return;
    }

    fetchRestaurants();
  };

  const handleCreateRestaurant = async () => {
    const name = prompt('Restaurant name');
    if (!name) return;
    const ownerName = prompt('Owner name');
    if (!ownerName) return;

    let email = '';
    while (true) {
      const value = prompt('Restaurant email (@gmail.com required)');
      if (value === null) return;
      if (!isValidGmail(value)) {
        alert('Invalid email. Please enter a valid Gmail address (example@gmail.com).');
        continue;
      }
      email = value;
      break;
    }

    let phone = '';
    while (true) {
      const value = prompt('Phone number (required)');
      if (value === null) return;
      if (!isValidPhone(value)) {
        alert('Invalid phone number. Use digits with optional +, spaces or dashes.');
        continue;
      }
      phone = value;
      break;
    }

    const addressLine1 = prompt('Address line');
    if (!addressLine1) return;
    const imageUrl = prompt('Restaurant image URL (optional)') || '';

    const response = await fetch('/api/admin/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        ownerName,
        email,
        phone,
        imageUrl,
        addressLine1,
        city: 'Alexandria',
        state: 'Alexandria',
        postalCode: '21563',
        status: 'pending',
      }),
    });
    if (!response.ok) {
      const message = await getErrorMessage(response);
      alert(`Failed to create restaurant: ${message}`);
      return;
    }
    fetchRestaurants();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-1">Manage Restaurants</h1>
              <p className="text-gray-600">Approve, manage, and monitor restaurants</p>
            </div>
            <button
              onClick={handleCreateRestaurant}
              className="px-6 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Restaurant
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-6 py-2 rounded-full transition-all ${
                  statusFilter === 'all'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-6 py-2 rounded-full transition-all ${
                  statusFilter === 'active'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-6 py-2 rounded-full transition-all ${
                  statusFilter === 'inactive'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-6 py-2 rounded-full transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-3xl">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-3xl text-green-600">{stats.active}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Inactive</div>
              <div className="text-3xl text-gray-600">{stats.inactive}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-3xl text-yellow-600">{stats.pending}</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 mb-6">
              <p className="text-gray-500">Loading restaurants...</p>
            </div>
          )}

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg">{restaurant.name}</h3>
                      {restaurant.rating && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{restaurant.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Owner: {restaurant.owner}</p>
                    <p className="text-sm text-gray-600">{restaurant.email}</p>
                    <p className="text-sm text-gray-600">{restaurant.phone}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      restaurant.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : restaurant.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-sm text-gray-600">{restaurant.address}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Orders</div>
                      <div className="text-sm">{restaurant.orders}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Revenue</div>
                      <div className="text-sm">${restaurant.revenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Rating</div>
                      <div className="text-sm">{restaurant.rating ? restaurant.rating : 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {restaurant.status === 'pending' ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(restaurant.id)}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(restaurant.id)}
                      className="flex-1 py-2.5 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                      restaurant.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        restaurant.status === 'active' ? 'bg-green-600' : 'bg-gray-400'
                      }`} />
                      {restaurant.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                    <div className="flex-1" />
                    <button
                      onClick={() => navigate(`/admin/restaurants/${restaurant.id}/edit`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isLoading && restaurants.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No restaurants found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
