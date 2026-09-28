import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdminSidebar } from '../components/AdminSidebar';
import { ArrowLeft, Image, Mail, MapPin, Phone, Save, Store } from 'lucide-react';

type RestaurantStatus = 'active' | 'inactive' | 'pending';

interface RestaurantForm {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  imageUrl: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  status: RestaurantStatus;
}

const emptyForm: RestaurantForm = {
  id: '',
  name: '',
  ownerName: '',
  email: '',
  phone: '',
  imageUrl: '',
  addressLine1: '',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  status: 'pending',
};

export default function AdminRestaurantEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const restaurantId = params.id || '';
  const [form, setForm] = useState<RestaurantForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!restaurantId) {
        setError('Restaurant id is missing');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/admin/restaurants/${restaurantId}`);
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load restaurant');
        }

        setForm({
          id: payload.id,
          name: payload.name || '',
          ownerName: payload.ownerName || '',
          email: payload.email || '',
          phone: payload.phone || '',
          imageUrl: payload.imageUrl || '',
          addressLine1: payload.addressLine1 || '',
          city: payload.city || 'New York',
          state: payload.state || 'NY',
          postalCode: payload.postalCode || '10001',
          status: payload.status || 'pending',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  const handleChange = (field: keyof RestaurantForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update restaurant');
      }

      navigate('/admin/restaurants');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('/admin/restaurants')}
                className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#e95322]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to restaurants
              </button>
              <h1 className="text-3xl">Edit Restaurant</h1>
              <p className="mt-1 text-gray-600">Update the restaurant and owner details from one page.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              Loading restaurant...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-[#fef2ef] p-3 text-[#e95322]">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl">Restaurant Details</h2>
                    <p className="text-sm text-gray-500">Name, owner, and contact information.</p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <label className="block">
                    <div className="mb-2 text-sm text-gray-600">Restaurant name</div>
                    <input
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                      required
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 text-sm text-gray-600">Owner name</div>
                    <input
                      value={form.ownerName}
                      onChange={(e) => handleChange('ownerName', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                      required
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 text-sm text-gray-600">Email</div>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition-colors focus:border-[#e95322]"
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <div className="mb-2 text-sm text-gray-600">Phone</div>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition-colors focus:border-[#e95322]"
                        required
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-[#eef5ff] p-3 text-[#2764e7]">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl">Location & Status</h2>
                      <p className="text-sm text-gray-500">Address, image, and visibility.</p>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <label className="block">
                      <div className="mb-2 text-sm text-gray-600">Image URL</div>
                      <div className="relative">
                        <Image className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          value={form.imageUrl}
                          onChange={(e) => handleChange('imageUrl', e.target.value)}
                          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition-colors focus:border-[#e95322]"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <div className="mb-2 text-sm text-gray-600">Address line</div>
                      <input
                        value={form.addressLine1}
                        onChange={(e) => handleChange('addressLine1', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                        required
                      />
                    </label>

                    <div className="grid grid-cols-3 gap-4">
                      <label className="block">
                        <div className="mb-2 text-sm text-gray-600">City</div>
                        <input
                          value={form.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                        />
                      </label>

                      <label className="block">
                        <div className="mb-2 text-sm text-gray-600">State</div>
                        <input
                          value={form.state}
                          onChange={(e) => handleChange('state', e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                        />
                      </label>

                      <label className="block">
                        <div className="mb-2 text-sm text-gray-600">Postal</div>
                        <input
                          value={form.postalCode}
                          onChange={(e) => handleChange('postalCode', e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <div className="mb-2 text-sm text-gray-600">Status</div>
                      <select
                        value={form.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="text-sm text-gray-500">Restaurant ID</div>
                  <div className="mt-2 break-all rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">{form.id}</div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e95322] px-5 py-3 text-white transition-colors hover:bg-[#d14719] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
