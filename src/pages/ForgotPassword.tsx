import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { getPasswordIssues, isPasswordStrong, passwordRequirements } from '../utils/passwordRules';

type ResetRole = 'customer' | 'restaurant' | 'driver';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; role?: ResetRole } | null;

  const [email, setEmail] = useState(state?.email || '');
  const [role, setRole] = useState<ResetRole>(state?.role || 'customer');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordIssues = useMemo(() => getPasswordIssues(newPassword), [newPassword]);
  const passwordIsStrong = useMemo(() => isPasswordStrong(newPassword), [newPassword]);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  useEffect(() => {
    if (!message) return;
    if (message !== 'Password updated successfully. Redirecting to sign in...') return;

    const timeout = window.setTimeout(() => {
      navigate('/signin');
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [message, navigate]);

  const handleRequestOtp = async (event?: React.SyntheticEvent) => {
    event?.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || 'Failed to send OTP');
        return;
      }

      setOtpRequested(true);
      setOtpVerified(false);
      setMessage('OTP was sent to the server terminal. Enter it below to continue.');
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          otp,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || 'Failed to verify OTP');
        return;
      }

      setOtpVerified(true);
      setMessage('OTP verified. You can set a new password now.');
    } catch {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!passwordIsStrong) {
      setError(`Password must include: ${passwordIssues.join(', ')}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || 'Failed to reset password');
        return;
      }

      setMessage('Password updated successfully. Redirecting to sign in...');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setOtpRequested(false);
      setOtpVerified(false);
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('/signin', { state: role ? { selectedRole: role } : undefined })}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sign In
          </button>

          <div className="mb-8">
            <h1 className="text-4xl mb-2">Reset Password</h1>
            <p className="text-gray-600">Choose your account and set a new strong password</p>
          </div>

          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={!otpRequested ? handleRequestOtp : !otpVerified ? handleVerifyOtp : handleSubmit} autoComplete="off" className="space-y-5">
            <input
              type="text"
              name="fake-reset-username"
              autoComplete="username"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            <input
              type="password"
              name="fake-reset-password"
              autoComplete="new-password"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['customer', 'restaurant', 'driver'] as ResetRole[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition-colors ${
                      role === option
                        ? 'border-[#e95322] bg-[#fef2ef] text-[#e95322]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="reset-email-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Gmail address"
                  autoComplete="off"
                  data-lpignore="true"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                  required
                />
              </div>
            </div>

            {!otpRequested ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">OTP sent</p>
                      <p className="text-xs text-amber-700 mt-1">
                        The 6-digit code was printed in the server terminal. It stays valid for 10 minutes.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">OTP Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter the 6-digit OTP"
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                      required
                      disabled={otpVerified}
                    />
                  </div>
                </div>

                {otpVerified && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="reset-new-password-field"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, Aa, 1 number, 1 special"
                      autoComplete="new-password"
                      data-lpignore="true"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                      required
                    />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">Your password must include:</p>
                      <div className="space-y-2">
                        {passwordRequirements.map((requirement) => {
                          const met = requirement.test(newPassword);
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

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="reset-confirm-password-field"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your new password"
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
                      {confirmPassword && (
                        <p className={`mt-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpRequested(false);
                      setOtpVerified(false);
                      setOtp('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setError('');
                      setMessage('');
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      (!otpVerified && otp.length !== 6) ||
                      (otpVerified && (!passwordIsStrong || (confirmPassword.length > 0 && !passwordsMatch)))
                    }
                    className="flex-1 bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Please wait...' : otpVerified ? 'Update Password' : 'Verify OTP'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="w-full text-sm text-[#e95322] hover:underline disabled:text-gray-400"
                >
                  Resend OTP
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#e95322] to-[#ff6b35] items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h2 className="text-5xl mb-6">Secure Access</h2>
          <p className="text-xl mb-8 text-white/90">
            Reset your password safely and keep your new account credentials strong from the start.
          </p>
          <div className="space-y-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm opacity-90">Strong password</div>
              <div className="text-lg">8+ chars, uppercase, lowercase, number, special character</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm opacity-90">For existing accounts</div>
              <div className="text-lg">Reset only when the account owner requests it</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
