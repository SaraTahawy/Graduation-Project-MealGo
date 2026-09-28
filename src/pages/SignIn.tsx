import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { setCurrentUserSession } from '../utils/session';

type SignInRole = 'customer' | 'admin' | 'restaurant' | 'driver';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<SignInRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [pendingCredentials, setPendingCredentials] = useState<{
    id?: string;
    role: SignInRole;
    email: string;
    name: string;
    restaurantId?: string | null;
    restaurantName?: string | null;
    driverId?: string | null;
  } | null>(null);

  useEffect(() => {
    const state = location.state as { selectedRole?: string } | null;
    if (state?.selectedRole) {
      const role = state.selectedRole as 'customer' | 'admin' | 'restaurant' | 'driver';
      setSelectedRole(role);
    }
  }, [location.state]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthTicket = params.get('oauth_ticket');
    const oauthError = params.get('oauth_error');

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      return;
    }
    if (!oauthTicket) return;

    const completeOauth = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/auth/oauth/complete?ticket=${encodeURIComponent(oauthTicket)}`);
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          setError(err.message || 'Google sign in failed');
          return;
        }
        const userData = await response.json();
        setPendingCredentials({
          id: userData.id,
          role: userData.role,
          email: userData.email,
          name: userData.name,
          restaurantId: userData.restaurantId ?? null,
          restaurantName: userData.restaurantName ?? null,
          driverId: userData.driverId ?? null,
        });
        setSelectedRole(userData.role);
        setShowTwoFA(true);
        setTwoFACode('');
      } catch {
        setError('Google sign in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    completeOauth();
  }, [location.search]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedRole) {
      setError('Please select a role first');
      setLoading(false);
      return;
    }

    try {
      // Check credentials with backend
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      });
      
      if (response.ok) {
        const userData = await response.json();

        if (userData.twoFactorRequired) {
          setPendingCredentials({
            id: userData.userId ?? userData.id,
            role: userData.role,
            email: userData.email,
            name: userData.name,
            restaurantId: userData.restaurantId ?? null,
            restaurantName: userData.restaurantName ?? null,
            driverId: userData.driverId ?? null,
          });
          setShowTwoFA(true);
          setTwoFACode('');
          return;
        }

        // No 2FA required - sign in immediately
        const currentUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          restaurantId: userData.restaurantId ?? null,
          restaurantName: userData.restaurantName ?? null,
          driverId: userData.driverId ?? null,
        };
        setCurrentUserSession(currentUser);

        switch (currentUser.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'restaurant':
            navigate('/restaurant/dashboard');
            break;
          case 'driver':
            navigate('/driver/dashboard');
            break;
          default:
            navigate('/order');
        }
      } else {
        const err = await response.json().catch(() => ({}));
        setError(err.message || 'Invalid email or password for this role');
      }
    } catch (err) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleTwoFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[0-9]{6}$/.test(twoFACode)) {
      setError('Invalid 2FA code. Please enter a 6-digit code.');
      return;
    }

    if (!pendingCredentials) {
      setError('No pending sign in session. Please sign in again.');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: pendingCredentials.id, code: twoFACode }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setError(err.message || 'Invalid 2FA code');
        return;
      }

      const userData = await response.json();
      const currentUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        restaurantId: userData.restaurantId ?? null,
        restaurantName: userData.restaurantName ?? null,
        driverId: userData.driverId ?? null,
      };

      setCurrentUserSession(currentUser);

      switch (currentUser.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'restaurant':
          navigate('/restaurant/dashboard');
          break;
        case 'driver':
          navigate('/driver/dashboard');
          break;
        default:
          navigate('/order');
      }
    } catch (err) {
      setError('Failed to verify 2FA. Please try again.');
    }
  };
  const handleGoogleSignIn = async () => {
    if (!selectedRole) {
      setError('Please select a role first');
      return;
    }
    if (selectedRole === 'admin') {
      setError('Google sign in is not available for admin');
      return;
    }
    window.location.href = `/auth/google/start?mode=signin&role=${encodeURIComponent(selectedRole)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="mb-8">
            <h1 className="text-4xl mb-2">Login to MealGo</h1>
            <p className="text-gray-600">Select your role and enter your credentials</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3 text-gray-700">Login As</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setSelectedRole('customer');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className={`py-3 px-2 rounded-lg font-medium text-sm transition-all border-2 ${
                  selectedRole === 'customer'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  setSelectedRole('restaurant');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className={`py-3 px-2 rounded-lg font-medium text-sm transition-all border-2 ${
                  selectedRole === 'restaurant'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Restaurant
              </button>
              <button
                onClick={() => {
                  setSelectedRole('driver');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className={`py-3 px-2 rounded-lg font-medium text-sm transition-all border-2 ${
                  selectedRole === 'driver'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Driver
              </button>
              <button
                onClick={() => {
                  setSelectedRole('admin');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className={`py-3 px-2 rounded-lg font-medium text-sm transition-all border-2 ${
                  selectedRole === 'admin'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* 2FA Verification Screen */}
          {showTwoFA && pendingCredentials ? (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Two-Factor Authentication</strong>
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  Enter the verification code shown in the server terminal (for demo/testing).
                </p>
              </div>

              <form onSubmit={handleTwoFASubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Verification Code</label>
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] text-center text-2xl letter-spacing-lg transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors font-semibold"
                >
                  Verify & Sign In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowTwoFA(false);
                    setPendingCredentials(null);
                    setTwoFACode('');
                    setError('');
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 py-2 transition-colors"
                >
                  Back to Login
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} autoComplete="off" className="space-y-5">
                <input
                  type="text"
                  name="fake-username"
                  autoComplete="username"
                  tabIndex={-1}
                  className="hidden"
                  aria-hidden="true"
                />
                <input
                  type="password"
                  name="fake-password"
                  autoComplete="current-password"
                  tabIndex={-1}
                  className="hidden"
                  aria-hidden="true"
                />
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="signin-email-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        selectedRole === 'customer' ? 'e.g. ahmad@example.com' :
                        selectedRole === 'admin' ? 'e.g. admin@mealgo.com' :
                        selectedRole === 'restaurant' ? 'e.g. john@gramercy.com' :
                        selectedRole === 'driver' ? 'e.g. john.driver@example.com' :
                        'Enter your email'
                      }
                      autoComplete="off"
                      data-lpignore="true"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="signin-password-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        selectedRole === 'customer' ? 'e.g. customer123' :
                        selectedRole === 'admin' ? 'e.g. admin123' :
                        selectedRole === 'restaurant' ? 'e.g. rest123' :
                        selectedRole === 'driver' ? 'e.g. driver123' :
                        'Enter your password'
                      }
                      autoComplete="new-password"
                      data-lpignore="true"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password', {
                        state: {
                          email,
                          role: selectedRole && selectedRole !== 'admin' ? selectedRole : 'customer',
                        },
                      })}
                      className="text-sm text-[#e95322] hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={!selectedRole}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    selectedRole
                      ? 'bg-[#e95322] text-white hover:bg-[#d14719]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedRole ? `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Select a Role First'}
                </button>
              </form>

              {/* Divider */}
              {selectedRole && selectedRole !== 'admin' && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </button>

                  {/* Sign Up Link */}
                  {selectedRole !== 'admin' && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="text-[#e95322] hover:underline font-semibold"
                      >
                        Create one
                      </button>
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#e95322] to-[#ff6b35] items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h2 className="text-5xl mb-6">MealGo</h2>
          <p className="text-xl mb-8 text-white/90">
            Your favorite food, delivered fast. Join thousands of happy customers enjoying seamless food delivery.
          </p>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-1">10K+</div>
              <div className="text-sm text-white/80">Restaurants</div>
            </div>
            <div>
              <div className="text-3xl mb-1">50K+</div>
              <div className="text-sm text-white/80">Customers</div>
            </div>
            <div>
              <div className="text-3xl mb-1">5K+</div>
              <div className="text-sm text-white/80">Drivers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
