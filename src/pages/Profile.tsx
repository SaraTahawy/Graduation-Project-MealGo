import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { User, MapPin, Mail, Lock, Save, Package, Clock, Wallet, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import { useWalletCoupons } from '../hooks/useWallet';
import { getPasswordIssues, isPasswordStrong, passwordRequirements } from '../utils/passwordRules';
import { getActiveRoleSession, getCurrentUserSession, hydrateRoleSession, getRoleSession, setCurrentUserSession, type StoredUser } from '../utils/session';

const DEFAULT_ALEX_ADDRESS = {
  address: '45 Corniche Road, Al Raml Station',
  city: 'Alexandria',
  state: 'Alexandria',
  postalCode: '21563',
};

const isLegacyRestaurantAddress = (address?: string | null, city?: string | null, state?: string | null, postalCode?: string | null) => {
  const normalizedAddress = String(address || '').trim().toLowerCase();
  const normalizedCity = String(city || '').trim().toLowerCase();
  const normalizedState = String(state || '').trim().toLowerCase();
  const normalizedPostalCode = String(postalCode || '').trim().toLowerCase();
  const knownLegacyAddresses = new Set(['address tbd', '10 e 20th st', '200 5th ave', '88 w 3rd st']);
  const knownLegacyPostalCodes = new Set(['10001', '10003', '10010', '10012']);

  return (
    knownLegacyAddresses.has(normalizedAddress) &&
    normalizedCity === 'new york' &&
    normalizedState === 'ny' &&
    knownLegacyPostalCodes.has(normalizedPostalCode)
  );
};

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { walletAddress, coupons, connectWallet, loadUserCoupons, setWalletAddress, setCoupons, disconnectWallet } = useWalletCoupons();
  const [walletInput, setWalletInput] = useState('');
  const resolveUserSession = (): StoredUser | null => {
    const preferredRole = new URLSearchParams(location.search).get('role');
    if (preferredRole === 'driver') return getActiveRoleSession('driver') || getCurrentUserSession();
    if (preferredRole === 'restaurant') return getActiveRoleSession('restaurant') || getCurrentUserSession();
    if (preferredRole === 'customer') return getActiveRoleSession('customer') || getCurrentUserSession();
    const current = getCurrentUserSession();
    if (current?.role === 'driver') return current;
    if (current?.role === 'restaurant') return current;
    if (current?.role === 'customer') return current;
    return getRoleSession('driver') || getRoleSession('restaurant') || getRoleSession('customer') || current;
  };
  const [parsedUser, setParsedUser] = useState<StoredUser | null>(() => resolveUserSession());
  const userRole: 'customer' | 'driver' | 'restaurant' | null = parsedUser?.role || null;

  useEffect(() => {
    let isMounted = true;

    const syncUser = async () => {
      const preferredRole = new URLSearchParams(location.search).get('role');
      const roleToHydrate =
        preferredRole === 'driver' || preferredRole === 'restaurant' || preferredRole === 'customer'
          ? preferredRole
          : undefined;

      const resolved = roleToHydrate ? await hydrateRoleSession(roleToHydrate) : resolveUserSession();
      if (!isMounted) return;

      setParsedUser(resolved);
      if (resolved) setCurrentUserSession(resolved);
    };

    syncUser();
    window.addEventListener('userChanged', syncUser);
    window.addEventListener('storage', syncUser);
    window.addEventListener('focus', syncUser);

    return () => {
      window.removeEventListener('userChanged', syncUser);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
      isMounted = false;
    };
  }, [location.search]);

  // clear wallet state if role changes away from customer
  useEffect(() => {
    if (userRole !== 'customer') {
      setWalletAddress('');
      setWalletInput('');
      setCoupons([]);
    }
  }, [userRole, setWalletAddress, setCoupons]);

  // whenever walletAddress updates (e.g. after connect), populate input
  useEffect(() => {
    if (walletAddress && walletInput === '') {
      setWalletInput(walletAddress);
    }
  }, [walletAddress]);
  const [profile, setProfile] = useState({
    restaurantName: parsedUser?.restaurantName || '',
    ownerName: parsedUser?.name || 'John Doe',
    name: parsedUser?.name || 'John Doe',
    email: parsedUser?.email || 'john.doe@example.com',
    phone: parsedUser?.phone || '+1 234 567 8900',
    address: DEFAULT_ALEX_ADDRESS.address,
    city: DEFAULT_ALEX_ADDRESS.city,
    state: DEFAULT_ALEX_ADDRESS.state,
    postalCode: DEFAULT_ALEX_ADDRESS.postalCode,
    vehicleType: 'Motorcycle',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [initialProfile, setInitialProfile] = useState({
    restaurantName: parsedUser?.restaurantName || '',
    ownerName: parsedUser?.name || 'John Doe',
    name: parsedUser?.name || 'John Doe',
    email: parsedUser?.email || 'john.doe@example.com',
    phone: parsedUser?.phone || '+1 234 567 8900',
    address: DEFAULT_ALEX_ADDRESS.address,
    city: DEFAULT_ALEX_ADDRESS.city,
    state: DEFAULT_ALEX_ADDRESS.state,
    postalCode: DEFAULT_ALEX_ADDRESS.postalCode,
    vehicleType: 'Motorcycle',
  });

  useEffect(() => {
    setProfile((current) => ({
      ...current,
      restaurantName: parsedUser?.restaurantName || current.restaurantName,
      ownerName: parsedUser?.name || current.ownerName,
      name: parsedUser?.name || 'John Doe',
      email: parsedUser?.email || 'john.doe@example.com',
      phone: parsedUser?.phone || '+1 234 567 8900',
    }));
  }, [parsedUser]);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const passwordIssues = getPasswordIssues(profile.newPassword);
  const passwordIsStrong = isPasswordStrong(profile.newPassword);
  const passwordsMatch = profile.confirmPassword.length > 0 && profile.newPassword === profile.confirmPassword;

  useEffect(() => {
    const loadProfileDetails = async () => {
      if (!parsedUser?.id) return;

      try {
        if (parsedUser.role === 'restaurant' && parsedUser.restaurantId) {
          const restaurantResponse = await fetch(`/api/admin/restaurants/${parsedUser.restaurantId}`);
          const restaurantPayload = await restaurantResponse.json().catch(() => ({}));
          if (restaurantResponse.ok) {
            const useAlexDefaults = isLegacyRestaurantAddress(
              restaurantPayload.addressLine1,
              restaurantPayload.city,
              restaurantPayload.state,
              restaurantPayload.postalCode
            );
            const nextProfile = {
              restaurantName: restaurantPayload.name || profile.restaurantName,
              ownerName:
                restaurantPayload.ownerName ||
                parsedUser.name ||
                profile.ownerName ||
                restaurantPayload.name ||
                '',
              name: profile.name,
              email: restaurantPayload.email || profile.email,
              phone: restaurantPayload.phone || profile.phone,
              address: useAlexDefaults ? DEFAULT_ALEX_ADDRESS.address : restaurantPayload.addressLine1 || profile.address,
              city: useAlexDefaults ? DEFAULT_ALEX_ADDRESS.city : restaurantPayload.city || profile.city,
              state: useAlexDefaults ? DEFAULT_ALEX_ADDRESS.state : restaurantPayload.state || profile.state,
              postalCode: useAlexDefaults ? DEFAULT_ALEX_ADDRESS.postalCode : restaurantPayload.postalCode || profile.postalCode,
              vehicleType: profile.vehicleType,
            };
            setProfile((current) => ({
              ...current,
              ...nextProfile,
            }));
            setInitialProfile(nextProfile);
            return;
          }
        }

        const response = await fetch(`/api/admin/users/${parsedUser.id}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) return;

        const nextProfile = {
          restaurantName: profile.restaurantName,
          ownerName: profile.ownerName,
          name: payload.name || profile.name,
          email: payload.email || profile.email,
          phone: payload.phone || profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          postalCode: profile.postalCode,
          vehicleType: payload.vehicleType || 'Motorcycle',
        };
        setProfile((current) => ({
          ...current,
          ...nextProfile,
        }));
        setInitialProfile(nextProfile);
      } catch {
        // ignore profile fetch failure
      }
    };

    loadProfileDetails();
  }, [parsedUser?.id]);

  const handleSave = async () => {
    if (!parsedUser?.id || !parsedUser.role) return;

    try {
      if (parsedUser.role === 'restaurant' && parsedUser.restaurantId) {
        const ownerName = (profile.ownerName || parsedUser.name || profile.restaurantName || '').trim();
        const restaurantName = (profile.restaurantName || ownerName || '').trim();
        const email = profile.email.trim().toLowerCase();
        const phone = profile.phone.trim();
        const addressLine1 = profile.address.trim();
        const city = profile.city.trim();
        const state = profile.state.trim();
        const postalCode = profile.postalCode.trim();

        if (!restaurantName || !ownerName || !email || !phone || !addressLine1) {
          alert('Please fill restaurant name, owner name, email, phone, and address.');
          return;
        }

        const hasChanges =
          restaurantName !== initialProfile.restaurantName.trim() ||
          ownerName !== initialProfile.ownerName.trim() ||
          email !== initialProfile.email.trim().toLowerCase() ||
          phone !== initialProfile.phone.trim() ||
          addressLine1 !== initialProfile.address.trim() ||
          city !== initialProfile.city.trim() ||
          state !== initialProfile.state.trim() ||
          postalCode !== initialProfile.postalCode.trim();

        if (!hasChanges) {
          setIsEditing(false);
          alert('No changes to save.');
          return;
        }

        const response = await fetch(`/api/admin/restaurants/${parsedUser.restaurantId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: restaurantName,
            ownerName,
            email,
            phone,
            addressLine1,
            city,
            state,
            postalCode,
            status: 'active',
          }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          alert(payload.message || 'Failed to update restaurant profile');
          return;
        }

        const updatedRestaurantUser = {
          ...parsedUser,
          name: ownerName,
          email,
          phone,
          restaurantName: restaurantName || parsedUser.restaurantName,
        };
        setParsedUser(updatedRestaurantUser);
        setCurrentUserSession(updatedRestaurantUser);
        setProfile((current) => ({
          ...current,
          ownerName,
          restaurantName,
          email,
          phone,
          address: addressLine1,
          city,
          state,
          postalCode,
        }));
        setInitialProfile({
          restaurantName,
          ownerName,
          name: profile.name,
          email,
          phone,
          address: addressLine1,
          city,
          state,
          postalCode,
          vehicleType: profile.vehicleType,
        });
        setIsEditing(false);
        alert('Restaurant profile updated successfully!');
        return;
      }

      const trimmedName = profile.name.trim();
      const trimmedEmail = profile.email.trim().toLowerCase();
      const trimmedPhone = profile.phone.trim();
      const trimmedVehicleType = profile.vehicleType.trim();

      const hasChanges =
        trimmedName !== initialProfile.name.trim() ||
        trimmedEmail !== initialProfile.email.trim().toLowerCase() ||
        trimmedPhone !== initialProfile.phone.trim() ||
        (parsedUser.role === 'driver' && trimmedVehicleType !== initialProfile.vehicleType.trim());

      if (!hasChanges) {
        setIsEditing(false);
        alert('No changes to save.');
        return;
      }

      const response = await fetch(`/api/admin/users/${parsedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          role: parsedUser.role,
          vehicleType: parsedUser.role === 'driver' ? trimmedVehicleType : undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(payload.message || 'Failed to update profile');
        return;
      }

      const updatedUser = {
        ...parsedUser,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
      };
      setParsedUser(updatedUser);
      setCurrentUserSession(updatedUser);
      setInitialProfile({
        restaurantName: profile.restaurantName,
        ownerName: profile.ownerName,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        postalCode: profile.postalCode,
        vehicleType: trimmedVehicleType,
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch {
      alert('Failed to update profile');
    }
  };

  const resetPasswordForm = (clearFeedback = true) => {
    setProfile((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    setIsCurrentPasswordVerified(false);
    if (clearFeedback) {
      setPasswordError('');
      setPasswordSuccess('');
    }
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleVerifyCurrentPassword = async () => {
    if (!parsedUser?.id) {
      setPasswordError('User session not found. Please sign in again.');
      return;
    }

    if (!profile.currentPassword) {
      setPasswordError('Enter your current password first');
      return;
    }

    setPasswordError('');
    setPasswordSuccess('');
    setIsVerifyingPassword(true);

    try {
      const response = await fetch('/api/auth/verify-current-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parsedUser.id,
          currentPassword: profile.currentPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPasswordError(data.message || 'Current password is incorrect');
        return;
      }

      setIsCurrentPasswordVerified(true);
      setPasswordSuccess('Current password verified. You can enter a new password now.');
    } catch {
      setPasswordError('Failed to verify current password. Please try again.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!parsedUser?.id) {
      setPasswordError('User session not found. Please sign in again.');
      return;
    }

    if (!isCurrentPasswordVerified) {
      setPasswordError('Verify your current password first');
      return;
    }

    if (!passwordIsStrong) {
      setPasswordError(`Password must include: ${passwordIssues.join(', ')}`);
      return;
    }

    if (profile.newPassword !== profile.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordError('');
    setPasswordSuccess('');
    setIsUpdatingPassword(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parsedUser.id,
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPasswordError(data.message || 'Failed to update password');
        return;
      }

      resetPasswordForm(false);
      setPasswordSuccess('Password updated successfully.');
    } catch {
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const orderStats = {
    total: 24,
    thisMonth: 8,
    totalSpent: 1247.50
  };
  const showCustomerSections = userRole === 'customer';
  const showAddressFields = userRole !== 'driver';
  const isRestaurantProfile = userRole === 'restaurant';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={userRole || undefined} isLoggedIn={userRole === 'customer'} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-4xl mb-2">
              {isRestaurantProfile ? 'Restaurant Profile' : 'My Profile'}
            </h1>
            <p className="text-xl text-gray-600">
              {isRestaurantProfile ? 'Manage your restaurant details and owner account' : 'Manage your account settings'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#e95322] to-[#ff6b35] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                  {(isRestaurantProfile ? profile.restaurantName || profile.ownerName : profile.name).charAt(0)}
                </div>
                <h2 className="text-2xl mb-1">{isRestaurantProfile ? profile.restaurantName || profile.ownerName : profile.name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-[#fef2ef] text-[#e95322] py-3 rounded-xl hover:bg-[#ffdecf] transition-colors"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {showCustomerSections && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#e95322]" />
                    Order Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="text-xl">{orderStats.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">This Month</span>
                      <span className="text-xl">{orderStats.thisMonth}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="text-xl text-[#e95322]">${orderStats.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#e95322]" />
                    Wallet & Coupons
                  </h3>
                <>
                  <input
                    type="text"
                    placeholder="Enter your wallet address"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                  />
                  {!walletAddress ? (
                    <button
                      onClick={async () => {
                        const addr = await connectWallet();
                        if (walletInput && addr && addr.toLowerCase() !== walletInput.toLowerCase()) {
                          alert('MetaMask address does not match entered address');
                        }
                      }}
                      className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d84315] transition-colors"
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-4">Connected: {walletAddress}</p>
                      <h4 className="text-md mb-2">Your NFT Coupons:</h4>
                      {coupons.length === 0 ? (
                        <p className="text-gray-500">No coupons found.</p>
                      ) : (
                        <div className="space-y-2">
                          {coupons.map((coupon) => (
                            <div key={coupon.id} className="bg-gray-50 p-3 rounded-lg">
                              <p><strong>ID:</strong> {coupon.nft_token_id || 'n/a'}</p>
                              <p><strong>Code:</strong> {coupon.code}</p>
                              <p><strong>Discount:</strong> {coupon.discount_value}%</p>
                              <p><strong>Type:</strong> {coupon.discount_type}</p>
                              <p><strong>Valid Until:</strong> {new Date(coupon.valid_until).toLocaleDateString()}</p>
                              {coupon.onChainOwner && (
                                <p className="text-xs text-gray-500">
                                  Owner: {coupon.onChainOwner === 'error' ? 'error' : coupon.onChainOwner}
                                </p>
                              )}
                              {coupon.ownerMatch === false && (
                                <p className="text-xs text-red-500">
                                  ⚠️ Token not owned by connected wallet
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => disconnectWallet()}
                        className="mt-4 w-full px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-2xl mb-6">Personal Information</h3>

              <div className="space-y-6">
                {isRestaurantProfile ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#e95322]" />
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        value={profile.restaurantName}
                        onChange={(e) => setProfile({ ...profile, restaurantName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#e95322]" />
                        Owner Name
                      </label>
                      <input
                        type="text"
                        value={profile.ownerName}
                        onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#e95322]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#e95322]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {userRole === 'driver' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      value={profile.vehicleType || 'Motorcycle'}
                      onChange={(e) => setProfile({ ...profile, vehicleType: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Car">Car</option>
                      <option value="Bicycle">Bicycle</option>
                    </select>
                  </div>
                )}

                {showAddressFields && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#e95322]" />
                      {isRestaurantProfile ? 'Restaurant Address' : 'Delivery Address'}
                    </label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500 mb-3"
                    />
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      disabled={!isEditing}
                      placeholder={isRestaurantProfile ? 'City' : 'City'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500 mb-3"
                    />
                    {isRestaurantProfile && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Governorate</label>
                          <input
                            type="text"
                            value={profile.state}
                            onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Governorate"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Postal Code</label>
                          <input
                            type="text"
                            value={profile.postalCode}
                            onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Postal Code"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full bg-[#e95322] text-white py-4 rounded-xl hover:bg-[#d14719] transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
              <h3 className="text-2xl mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#e95322]" />
                Change Password
              </h3>

              <form autoComplete="off" className="space-y-4">
                <input
                  type="text"
                  name="fake-profile-username"
                  autoComplete="username"
                  tabIndex={-1}
                  className="hidden"
                  aria-hidden="true"
                />
                <input
                  type="password"
                  name="fake-profile-current-password"
                  autoComplete="current-password"
                  tabIndex={-1}
                  className="hidden"
                  aria-hidden="true"
                />
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="profile-current-password-field"
                      value={profile.currentPassword}
                      onChange={(e) => {
                        setProfile({ ...profile, currentPassword: e.target.value });
                        setIsCurrentPasswordVerified(false);
                        setPasswordError('');
                        setPasswordSuccess('');
                      }}
                      className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                      placeholder="Enter current password"
                      autoComplete="off"
                      data-lpignore="true"
                      data-form-type="other"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {passwordSuccess}
                  </div>
                )}

                {!isCurrentPasswordVerified ? (
                  <button
                    type="button"
                    onClick={handleVerifyCurrentPassword}
                    disabled={isVerifyingPassword || !profile.currentPassword}
                    className="w-full bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isVerifyingPassword ? 'Verifying...' : 'Verify Current Password'}
                  </button>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="profile-new-password-field"
                          value={profile.newPassword}
                          onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                          className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          data-lpignore="true"
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

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">Your password must include:</p>
                      <div className="space-y-2">
                        {passwordRequirements.map((requirement) => {
                          const met = requirement.test(profile.newPassword);
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
                      <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="profile-confirm-password-field"
                          value={profile.confirmPassword}
                          onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                          className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                          data-lpignore="true"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {profile.confirmPassword && (
                        <p className={`mt-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={resetPasswordForm}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdatePassword}
                        disabled={isUpdatingPassword || !passwordIsStrong || (profile.confirmPassword.length > 0 && !passwordsMatch)}
                        className="flex-1 bg-[#e95322] text-white py-3 rounded-xl hover:bg-[#d14719] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
