import { Link, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Utensils, User, Wallet, LogOut } from 'lucide-react';
import { useWalletCoupons } from '../hooks/useWallet';
import {
  clearRoleSession,
  getActiveRoleSession,
  getCurrentUserSession,
  getRoleSession,
  setCurrentUserSession,
  type StoredUser,
} from '../utils/session';

interface NavbarProps {
  role?: 'customer' | 'driver' | 'restaurant';
  isLoggedIn?: boolean;
}

export function Navbar({ role, isLoggedIn = false }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [storedUser, setStoredUser] = useState<StoredUser | null>(() => getCurrentUserSession());
  const [customerSession, setCustomerSession] = useState<StoredUser | null>(() => getRoleSession('customer'));

  useEffect(() => {
    const syncSessions = () => {
      setStoredUser(getCurrentUserSession());
      setCustomerSession(getRoleSession('customer'));
    };

    syncSessions();
    window.addEventListener('userChanged', syncSessions);
    window.addEventListener('storage', syncSessions);
    window.addEventListener('focus', syncSessions);
    document.addEventListener('visibilitychange', syncSessions);

    return () => {
      window.removeEventListener('userChanged', syncSessions);
      window.removeEventListener('storage', syncSessions);
      window.removeEventListener('focus', syncSessions);
      document.removeEventListener('visibilitychange', syncSessions);
    };
  }, []);

  const userRole: 'customer' | 'driver' | 'restaurant' | null =
    storedUser && (storedUser.role === 'customer' || storedUser.role === 'driver' || storedUser.role === 'restaurant')
      ? storedUser.role
      : null;
  const activeCustomer =
    customerSession?.role === 'customer'
      ? customerSession
      : userRole === 'customer'
      ? storedUser
      : null;

  const { walletAddress, coupons, connectWallet, setWalletAddress, disconnectWallet } = useWalletCoupons();

  // clear wallet address if role not customer
  useEffect(() => {
    if (!activeCustomer) {
      setWalletAddress('');
    }
  }, [activeCustomer, setWalletAddress]);
  const [showCoupons, setShowCoupons] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getNavLinks = () => {
    if (role === 'driver') {
      return [
        { label: 'Dashboard', path: '/driver/dashboard' },
        { label: 'History', path: '/driver/history' },
      ];
    } else if (role === 'restaurant') {
      return [
        { label: 'Dashboard', path: '/restaurant/dashboard' },
        { label: 'Menu', path: '/restaurant/menu' },
        { label: 'Orders', path: '/restaurant/orders' },
        { label: 'Feedback', path: '/restaurant/feedback' },
      ];
    } else if (isLoggedIn || role === 'customer') {
      return [
        { label: 'Order Food', path: '/order' },
        { label: 'Orders', path: '/orders' },
        { label: 'Chatbot', path: '/chatbot' },
      ];
    } else {
      return [
        { label: 'Home', path: '/' },
        { label: 'Features', path: '#features' },
        { label: 'How It Works', path: '#how-it-works' },
        { label: 'For Partners', path: '#partners' },
      ];
    }
  };

  const navLinks = getNavLinks();
  const logoTarget =
    role === 'restaurant'
      ? '/restaurant/dashboard'
      : role === 'driver'
      ? '/driver/dashboard'
      : activeCustomer || isLoggedIn
      ? '/order'
      : '/';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 dark:bg-black dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={logoTarget} className="flex items-center gap-2">
            <div className="bg-[#e95322] rounded-xl p-2 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-[#e95322]">MealGo</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => {
              const isAnchorLink = link.path.startsWith('#');
              const id = isAnchorLink ? link.path.slice(1) : '';
              
              if (isAnchorLink && location.pathname === '/') {
                return (
                  <button
                    key={`${link.path}-${index}`}
                    onClick={(e) => handleSmoothScroll(e, id)}
                    className="text-base text-gray-600 hover:text-[#e95322] transition-colors dark:text-gray-200"
                  >
                    {link.label}
                  </button>
                );
              }
              
              return (
                <Link
                  key={`${link.path}-${index}`}
                  to={link.path}
                  className={`text-base transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#e95322]'
                      : 'text-gray-600 hover:text-[#e95322] dark:text-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {!role && !isLoggedIn && (
              <>
                <Link
                  to="/signin"
                  className="bg-[#e95322] text-white px-6 py-2 rounded-full hover:bg-[#d14719] transition-colors"
                >
                  Login
                </Link>
              </>
            )}
            {activeCustomer && isLoggedIn && (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      if (!walletAddress) connectWallet();
                      else setShowCoupons((prev) => !prev);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#fef2ef] text-[#e95322] rounded-full hover:bg-[#ffdecf] transition-colors dark:bg-gray-900 dark:text-orange-300 dark:hover:bg-gray-800"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>
                      {walletAddress
                        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                        : 'Connect Wallet'}
                    </span>
                  </button>
                  {walletAddress && (
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setShowCoupons(false);
                      }}
                      className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors text-sm"
                    >
                      Disconnect
                    </button>
                  )}
                  {showCoupons && walletAddress && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-10 dark:bg-gray-950 dark:border-gray-800 dark:text-white">
                      <h4 className="font-semibold mb-2">Your NFT Coupons</h4>
                      {coupons.length === 0 ? (
                        <p className="text-gray-500 text-sm dark:text-gray-400">No coupons found.</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-auto">
                          {coupons.map((c) => (
                            <div key={c.id} className="bg-gray-50 p-2 rounded dark:bg-gray-900">
                              <p className="text-xs">
                                <strong>Code:</strong> {c.code}
                              </p>
                              <p className="text-xs">
                                <strong>Discount:</strong> {c.discount_value}%
                              </p>
                              {c.ownerMatch === false && (
                                <p className="text-xs text-red-500">
                                  Ã¢Å¡Â Ã¯Â¸Â not owned
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-[#fef2ef] text-[#e95322] rounded-full hover:bg-[#ffdecf] transition-colors dark:bg-gray-900 dark:text-orange-300 dark:hover:bg-gray-800"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={() => {
                    clearRoleSession('customer');
                    navigate('/');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
            {role === 'driver' && (
              <>
                <button
                  onClick={() => {
                    const driverSession = getActiveRoleSession('driver');
                    if (driverSession) setCurrentUserSession(driverSession);
                    navigate('/profile?role=driver');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#fef2ef] text-[#e95322] rounded-full hover:bg-[#ffdecf] transition-colors dark:bg-gray-900 dark:text-orange-300 dark:hover:bg-gray-800"
                >
                  <User className="w-5 h-5" />
                  <span>{storedUser?.name || 'Profile'}</span>
                </button>
                <button
                  onClick={() => {
                    clearRoleSession('driver');
                    navigate('/signin');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
            {role === 'restaurant' && (
              <>
                <button
                  onClick={() => {
                    const restaurantSession = getActiveRoleSession('restaurant');
                    if (restaurantSession) setCurrentUserSession(restaurantSession);
                    navigate('/profile?role=restaurant');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#fef2ef] text-[#e95322] rounded-full hover:bg-[#ffdecf] transition-colors dark:bg-gray-900 dark:text-orange-300 dark:hover:bg-gray-800"
                >
                  <User className="w-5 h-5" />
                  <span>{storedUser?.restaurantName || 'Restaurant Profile'}</span>
                </button>
                <button
                  onClick={() => {
                    clearRoleSession('restaurant');
                    navigate('/signin');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
