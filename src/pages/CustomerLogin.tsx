import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function CustomerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect to ordering page
    navigate('/order');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 bg-gray-100 p-4 rounded-2xl hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-3">Customer Login</h1>
          <p className="text-gray-600 text-lg">Welcome back! Please login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-lg mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#e95322] text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#e95322] text-lg pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-[#e95322] text-lg hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#e95322] text-white py-4 rounded-full text-lg hover:bg-[#d14719] transition-colors shadow-lg"
          >
            Login
          </button>

          <p className="text-center text-gray-600 text-lg">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#e95322] hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
