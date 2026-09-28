import { useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Store, 
  Bike,
  Ticket,
  HeadphonesIcon,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Store, label: 'Restaurants', path: '/admin/restaurants' },
  { icon: Bike, label: 'Drivers', path: '/admin/drivers' },
  { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
  { icon: HeadphonesIcon, label: 'Support', path: '/admin/support' },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 dark:bg-black dark:border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl text-[#e95322]">MealGo</h1>
        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-[#fef2ef] text-[#e95322] dark:bg-gray-900 dark:text-orange-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => navigate('/admin/settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 mb-2 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>
        <button
          onClick={() => {
            // clear stored user and notify wallet hook
            localStorage.removeItem('currentUser');
            window.dispatchEvent(new Event('userChanged'));
            navigate('/signin');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
