import { useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Plus, MapPin, Star, Edit, Trash2, Check, X, Bike, TrendingUp } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  joinedDate: string;
  deliveries: number;
  rating: number;
  earnings: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  currentLocation?: string;
  availability: 'available' | 'busy' | 'offline';
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'John Driver',
    email: 'john.driver@example.com',
    phone: '+1 234 567 8901',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'B 1234 CD',
    joinedDate: 'Jan 15, 2025',
    deliveries: 234,
    rating: 4.8,
    earnings: 2540,
    status: 'active',
    currentLocation: 'Jl. Sudirman, Jakarta',
    availability: 'available'
  },
  {
    id: '2',
    name: 'Mike Rider',
    email: 'mike.rider@example.com',
    phone: '+1 234 567 8902',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'B 5678 EF',
    joinedDate: 'Feb 10, 2025',
    deliveries: 189,
    rating: 4.9,
    earnings: 1890,
    status: 'active',
    currentLocation: 'Jl. Thamrin, Jakarta',
    availability: 'busy'
  },
  {
    id: '3',
    name: 'Tom Wilson',
    email: 'tom.wilson@example.com',
    phone: '+1 234 567 8903',
    vehicleType: 'Car',
    vehicleNumber: 'B 9012 GH',
    joinedDate: 'Jan 8, 2025',
    deliveries: 56,
    rating: 4.5,
    earnings: 680,
    status: 'inactive',
    availability: 'offline'
  },
  {
    id: '4',
    name: 'Sarah Delivery',
    email: 'sarah.delivery@example.com',
    phone: '+1 234 567 8904',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'B 3456 IJ',
    joinedDate: 'Mar 5, 2025',
    deliveries: 0,
    rating: 0,
    earnings: 0,
    status: 'pending',
    availability: 'offline'
  }
];

export default function AdminDrivers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Driver['status']>('all');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('status', statusFilter);
      const response = await fetch(`/api/admin/drivers?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch drivers');
      const data = await response.json();
      setDrivers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchDrivers, 250);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    inactive: drivers.filter(d => d.status === 'inactive').length,
    pending: drivers.filter(d => d.status === 'pending').length,
    available: drivers.filter(d => d.availability === 'available').length
  }), [drivers]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const handleApprove = async (id: string) => {
    const response = await fetch(`/api/admin/drivers/${id}/approve`, { method: 'PATCH' });
    if (!response.ok) {
      alert('Failed to approve driver');
      return;
    }
    fetchDrivers();
  };

  const handleReject = async (id: string) => {
    if (confirm('Are you sure you want to reject this driver?')) {
      const response = await fetch(`/api/admin/drivers/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        alert('Failed to reject driver');
        return;
      }
      fetchDrivers();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      const response = await fetch(`/api/admin/drivers/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        alert('Failed to delete driver');
        return;
      }
      fetchDrivers();
    }
  };

  const toggleStatus = async (id: string) => {
    const response = await fetch(`/api/admin/drivers/${id}/toggle-status`, { method: 'PATCH' });
    if (!response.ok) {
      alert('Failed to update status');
      return;
    }
    fetchDrivers();
  };

  const handleCreateDriver = async () => {
    const name = prompt('Driver name');
    if (!name) return;

    let email = '';
    while (true) {
      const value = prompt('Driver email (@gmail.com required)');
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

    const vehicleType = prompt('Vehicle type', 'Motorcycle') || 'Motorcycle';
    const vehicleNumber = prompt('Vehicle number');
    if (!vehicleNumber) return;

    const response = await fetch('/api/admin/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        vehicleType,
        vehicleNumber,
        status: 'pending',
      }),
    });
    if (!response.ok) {
      const message = await getErrorMessage(response);
      alert(`Failed to create driver: ${message}`);
      return;
    }
    fetchDrivers();
  };

  const getAvailabilityColor = (availability: Driver['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'busy': return 'bg-orange-100 text-orange-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
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
              <h1 className="text-3xl mb-1">Manage Drivers</h1>
              <p className="text-gray-600">Approve, manage, and track drivers</p>
            </div>
            <button
              onClick={handleCreateDriver}
              className="px-6 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Driver
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-3xl">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-3xl text-green-600">{stats.active}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Available Now</div>
              <div className="text-3xl text-blue-600">{stats.available}</div>
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

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drivers..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {['all', 'active', 'inactive', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-6 py-2 rounded-full transition-all ${
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
              <p className="text-gray-500">Loading drivers...</p>
            </div>
          )}

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-full flex items-center justify-center text-white text-2xl">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg">{driver.name}</h3>
                        {driver.rating > 0 && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm">{driver.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{driver.email}</p>
                      <p className="text-sm text-gray-600">{driver.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      driver.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : driver.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : driver.status === 'suspended'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                    </span>
                    {driver.status === 'active' && (
                      <span className={`px-3 py-1 rounded-full text-xs ${getAvailabilityColor(driver.availability)}`}>
                        {driver.availability.charAt(0).toUpperCase() + driver.availability.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Vehicle Type</div>
                      <div className="text-sm flex items-center gap-2">
                        <Bike className="w-4 h-4 text-gray-600" />
                        {driver.vehicleType}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Vehicle Number</div>
                      <div className="text-sm">{driver.vehicleNumber}</div>
                    </div>
                  </div>

                  {driver.currentLocation && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{driver.currentLocation}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Deliveries</div>
                    <div className="text-lg">{driver.deliveries}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Earnings</div>
                    <div className="text-lg text-green-600">${driver.earnings}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Joined</div>
                    <div className="text-sm">{formatDate(driver.joinedDate)}</div>
                  </div>
                </div>

                {/* Actions */}
                {driver.status === 'pending' ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(driver.id)}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(driver.id)}
                      className="flex-1 py-2.5 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-[#e95322] text-white rounded-lg hover:bg-[#d14719] transition-colors text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      View Performance
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => toggleStatus(driver.id)}
                      className={`px-3 py-2 rounded-lg text-xs ${
                        driver.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {driver.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isLoading && drivers.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No drivers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
