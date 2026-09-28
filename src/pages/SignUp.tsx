import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Mail, Lock, User, Building, Bike, CheckCircle2, Circle, Eye, EyeOff } from 'lucide-react';
import { setCurrentUserSession } from '../utils/session';
import { getPasswordIssues, isPasswordStrong, passwordRequirements } from '../utils/passwordRules';

type UserRole = 'customer' | 'restaurant' | 'driver';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | ''
  });
  const passwordIssues = getPasswordIssues(formData.password);
  const passwordIsStrong = isPasswordStrong(formData.password);
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthTicket = params.get('oauth_ticket');
    const oauthError = params.get('oauth_error');

    if (oauthError) {
      alert(decodeURIComponent(oauthError));
      return;
    }
    if (!oauthTicket) return;

    const completeOauth = async () => {
      try {
        const response = await fetch(`/api/auth/oauth/complete?ticket=${encodeURIComponent(oauthTicket)}`);
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          alert(err.message || 'Google OAuth failed');
          return;
        }
        const userData = await response.json();
        setCurrentUserSession({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          restaurantId: userData.restaurantId,
          restaurantName: userData.restaurantName,
          driverId: userData.driverId,
        });

        switch (userData.role) {
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
        console.error('Google OAuth complete error:', err);
        alert('Google OAuth failed. Please try again.');
      }
    };

    completeOauth();
  }, [location.search, navigate]);

  const handleGoogleSignUp = async () => {
    if (!formData.role) {
      alert('Please choose an account type first');
      return;
    }
    window.location.href = `/auth/google/start?mode=signup&role=${encodeURIComponent(formData.role)}`;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordIsStrong) {
      alert(`Password must include: ${passwordIssues.join(', ')}`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.role) {
      alert('Name, email, and account type are required');
      return;
    }
    
    try {
      // Call SignUp API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Save user to localStorage
        setCurrentUserSession({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          restaurantId: userData.restaurantId,
          restaurantName: userData.restaurantName,
          driverId: userData.driverId,
        });
        
        // Redirect based on role
        switch (userData.role) {
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
        const error = await response.json();
        alert(error.message || 'Registration failed');
      }
    } catch (err) {
      console.error('SignUp error:', err);
      alert('Registration failed. Please try again.');
    }
  };

  const roleOptions = [
    { value: 'customer', label: 'Customer', icon: User, description: 'Order food from restaurants' },
    { value: 'restaurant', label: 'Restaurant', icon: Building, description: 'Manage your restaurant' },
    { value: 'driver', label: 'Driver', icon: Bike, description: 'Deliver orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl mb-2">Create Account</h1>
            <p className="text-gray-600">Join MealGo today</p>
          </div>

          <form onSubmit={handleSignUp} autoComplete="off" className="space-y-5">
            <input
              type="text"
              name="fake-signup-username"
              autoComplete="username"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            <input
              type="password"
              name="fake-signup-password"
              autoComplete="new-password"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            {/* Full Name */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="signup-fullname-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="signup-email-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">I want to</label>
              <div className="space-y-2">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: option.value as UserRole })}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                          formData.role === option.value
                            ? 'border-[#e95322] bg-[#fef2ef]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          formData.role === option.value ? 'bg-[#e95322] text-white' : 'bg-gray-100'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.role === option.value ? 'border-[#e95322]' : 'border-gray-300'
                        }`}>
                          {formData.role === option.value && (
                            <div className="w-3 h-3 rounded-full bg-[#e95322]" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="signup-password-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 chars, Aa, 1 number, 1 special"
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
              <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Your password must include:</p>
                <div className="space-y-2">
                  {passwordRequirements.map((requirement) => {
                    const met = requirement.test(formData.password);
                    const Icon = met ? CheckCircle2 : Circle;
                    return (
                      <div key={requirement.key} className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
                        <Icon className="w-4 h-4" />
                        <span>{requirement.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="signup-confirm-password-field"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  data-lpignore="true"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`mt-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-gray-300 text-[#e95322] focus:ring-[#e95322]" required />
              <span className="text-sm text-gray-600">
                I agree to the <button type="button" className="text-[#e95322] hover:underline">Terms of Service</button> and <button type="button" className="text-[#e95322] hover:underline">Privacy Policy</button>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={!formData.role || !passwordIsStrong || (formData.confirmPassword.length > 0 && !passwordsMatch)}
              className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="text-[#e95322] hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#e95322] to-[#ff6b35] items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h2 className="text-5xl mb-6">Start Your Journey</h2>
          <p className="text-xl mb-8 text-white/90">
            Whether you're looking to order, deliver, or manage a restaurant, MealGo has you covered.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">For Customers</div>
                <div className="text-lg">Browse & Order Easily</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">For Restaurants</div>
                <div className="text-lg">Grow Your Business</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">For Drivers</div>
                <div className="text-lg">Earn on Your Schedule</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
