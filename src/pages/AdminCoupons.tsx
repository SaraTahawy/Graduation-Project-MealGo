import { useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Plus, Edit, Trash2, Copy, CheckCircle, XCircle, Calendar, Percent } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free-delivery';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  status: 'active' | 'inactive' | 'expired';
  applicableFor: 'all' | 'new-users' | 'restaurants' | 'specific';
  nftTokenId?: string;
  nftContractAddress?: string;
}

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

export default function AdminCoupons() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Coupon['status']>('all');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('status', statusFilter);
      const response = await fetch(`/api/coupons?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load coupons');
      }
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = async (response: Response) => {
    try {
      const body = await response.json();
      return body?.message || 'Request failed';
    } catch {
      return 'Request failed';
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCoupons();
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter(c => c.status === 'active').length,
    inactive: coupons.filter(c => c.status === 'inactive').length,
    expired: coupons.filter(c => c.status === 'expired').length
  }), [coupons]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      const response = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        alert('Failed to delete coupon');
        return;
      }
      fetchCoupons();
    }
  };

  const toggleStatus = async (id: string) => {
    const response = await fetch(`/api/coupons/${id}/toggle-status`, { method: 'PATCH' });
    if (!response.ok) {
      alert('Coupon cannot be toggled');
      return;
    }
    fetchCoupons();
  };

  // ---------------- NFT VERSION ----------------
  const handleCreateCoupon = async () => {
    const code = prompt('Coupon code (e.g. WELCOME20)');
    if (!code) return;

    const discountType = prompt('Discount type: percentage | fixed | free-delivery', 'percentage') || 'percentage';
    const discountValue = prompt('Discount value (number)', '10') || '10';
    const walletAddress = prompt('User wallet address (Ethereum)') || '';
    if (!walletAddress) return;

    try {
      const response = await fetch('/api/admin/create-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: Number(discountValue),
          walletAddress
        }),
      });

      if (!response.ok) {
        const message = await response.json();
        alert(`Failed to create NFT coupon: ${message?.error || 'Unknown error'}`);
        return;
      }

      const data = await response.json();
      alert(`Coupon NFT created!\nToken ID: ${data.tokenId}\nContract: ${data.contractAddress}`);
      fetchCoupons(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to create coupon');
    }
  };
  // ---------------------------------------------

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-1">Coupons Management</h1>
              <p className="text-gray-600">Create and manage discount coupons</p>
            </div>
            <button
              onClick={handleCreateCoupon}
              className="px-6 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total Coupons</div>
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
              <div className="text-sm text-gray-600 mb-1">Expired</div>
              <div className="text-3xl text-red-600">{stats.expired}</div>
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
                  placeholder="Search coupons..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {['all', 'active', 'inactive', 'expired'].map((status) => (
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
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 mb-6">
              <p className="text-gray-500">Loading coupons...</p>
            </div>
          )}

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#e95322] to-[#ff6b35] rounded-xl">
                        <code className="text-white text-lg">{coupon.code}</code>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                        >
                          {copiedCode === coupon.code ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{coupon.description}</p>
                    {coupon.nftTokenId && (
                      <p className="text-xs text-gray-400 mt-1">
                        NFT Token ID: {coupon.nftTokenId}
                        {coupon.nftContractAddress && (
                          <><br />Contract: <span className="font-mono">{coupon.nftContractAddress}</span></>
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      coupon.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : coupon.status === 'expired'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Discount Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Discount</div>
                      <div className="text-base flex items-center gap-1">
                        {coupon.discountType === 'percentage' ? (
                          <>
                            <Percent className="w-4 h-4 text-[#e95322]" />
                            {coupon.discountValue}% off
                          </>
                        ) : coupon.discountType === 'free-delivery' ? (
                          <>Free delivery</>
                        ) : (
                          <>${coupon.discountValue} off</>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Min. Order</div>
                      <div className="text-base">${coupon.minOrderValue}</div>
                    </div>
                  </div>

                  {coupon.maxDiscount && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Max Discount</div>
                      <div className="text-sm">${coupon.maxDiscount}</div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#e95322] h-full transition-all"
                        style={{ width: `${(coupon.usageCount / Math.max(1, coupon.usageLimit)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {coupon.usageCount}/{coupon.usageLimit}
                    </span>
                  </div>
                </div>

                {/* Applicable For */}
                <div className="mb-4">
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {coupon.applicableFor === 'all' && 'All Users'}
                    {coupon.applicableFor === 'new-users' && 'New Users Only'}
                    {coupon.applicableFor === 'restaurants' && 'Restaurants'}
                    {coupon.applicableFor === 'specific' && 'Specific Users'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {coupon.status !== 'expired' && (
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      className={`px-4 py-2 rounded-xl transition-colors text-sm ${
                        coupon.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                  <div className="flex-1" />
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && coupons.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No coupons found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
