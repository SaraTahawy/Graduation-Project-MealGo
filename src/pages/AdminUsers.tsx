import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Plus, Edit, Trash2, Star, Ban, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'driver' | 'restaurant';
  joinedDate: string;
  orders?: number;
  rating?: number;
  revenue?: number;
  deliveries?: number;
  status: 'active' | 'inactive' | 'suspended';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8901',
    role: 'customer',
    joinedDate: 'Jun 15, 2025',
    orders: 45,
    rating: 4.9,
    status: 'active'
  },
  {
    id: '2',
    name: 'Mike Driver',
    email: 'mike@example.com',
    phone: '+1 234 567 8902',
    role: 'driver',
    joinedDate: 'Feb 10, 2025',
    orders: 234,
    revenue: 2540,
    rating: 4.8,
    status: 'active'
  },
  {
    id: '3',
    name: 'Sarah Restaurant',
    email: 'sarah@restaurant.com',
    phone: '+1 234 567 8903',
    role: 'restaurant',
    joinedDate: 'Mar 5, 2025',
    orders: 1234,
    revenue: 45230,
    rating: 4.7,
    status: 'active'
  },
  {
    id: '4',
    name: 'Emily Customer',
    email: 'emily@example.com',
    phone: '+1 234 567 8904',
    role: 'customer',
    joinedDate: 'Apr 20, 2025',
    orders: 12,
    rating: 5,
    status: 'active'
  },
  {
    id: '5',
    name: 'Tom Wilson',
    email: 'tom@example.com',
    phone: '+1 234 567 8905',
    role: 'driver',
    joinedDate: 'Jan 8, 2025',
    orders: 56,
    revenue: 680,
    rating: 4.5,
    status: 'inactive'
  },
  {
    id: '6',
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 234 567 8906',
    role: 'customer',
    joinedDate: 'Apr 5, 2025',
    orders: 3,
    rating: 3.2,
    status: 'suspended'
  }
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'driver' | 'restaurant'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('role', roleFilter);
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchUsers, 250);
    return () => clearTimeout(t);
  }, [searchQuery, roleFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    drivers: users.filter(u => u.role === 'driver').length,
    restaurants: users.filter(u => u.role === 'restaurant').length
  }), [users]);

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        alert('Failed to delete user');
        return;
      }
      fetchUsers();
    }
  };

  const toggleStatus = async (id: string) => {
    const response = await fetch(`/api/admin/users/${id}/toggle-status`, { method: 'PATCH' });
    if (!response.ok) {
      alert('Failed to update user status');
      return;
    }
    fetchUsers();
  };

  const handleCreateUser = async () => {
    const name = prompt('User name');
    if (!name) return;

    let email = '';
    while (true) {
      const value = prompt('User email (@gmail.com required)');
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

    const role = (prompt('Role: customer | driver | restaurant', 'customer') || 'customer') as User['role'];

    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, role, status: 'active' }),
    });
    if (!response.ok) {
      const message = await getErrorMessage(response);
      alert(`Failed to create user: ${message}`);
      return;
    }
    fetchUsers();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-1">Manage Users</h1>
              <p className="text-gray-600">View and manage all platform users</p>
            </div>
            <button
              onClick={handleCreateUser}
              className="px-6 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add User
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
                  placeholder="Search users..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-6 py-2 rounded-full transition-all ${
                  roleFilter === 'all'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRoleFilter('customer')}
                className={`px-6 py-2 rounded-full transition-all ${
                  roleFilter === 'customer'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setRoleFilter('driver')}
                className={`px-6 py-2 rounded-full transition-all ${
                  roleFilter === 'driver'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Driver
              </button>
              <button
                onClick={() => setRoleFilter('restaurant')}
                className={`px-6 py-2 rounded-full transition-all ${
                  roleFilter === 'restaurant'
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Restaurant
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
              <div className="text-sm text-gray-600 mb-1">Customers</div>
              <div className="text-3xl text-blue-600">{stats.customers}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Drivers</div>
              <div className="text-3xl text-purple-600">{stats.drivers}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Restaurants</div>
              <div className="text-3xl text-green-600">{stats.restaurants}</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 mb-6">
              <p className="text-gray-500">Loading users...</p>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm text-gray-600">User</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Contact</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Role</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Joined</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Orders</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Rating</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index === users.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-full flex items-center justify-center text-white">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          user.role === 'customer'
                            ? 'bg-blue-100 text-blue-700'
                            : user.role === 'driver'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{formatDate(user.joinedDate)}</td>
                      <td className="py-4 px-6 text-sm">{user.orders || 0}</td>
                      <td className="py-4 px-6">
                        {user.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{user.rating}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : user.status === 'suspended'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {user.status === 'suspended' && <Ban className="w-3 h-3" />}
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'active' ? 'hover:bg-red-50' : 'hover:bg-green-50'
                            }`}
                            title={user.status === 'active' ? 'Suspend' : 'Activate'}
                          >
                            {user.status === 'active' ? (
                              <Ban className="w-4 h-4 text-red-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!isLoading && users.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
