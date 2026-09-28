import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdminSidebar } from '../components/AdminSidebar';
import { ArrowLeft, Mail, Phone, Save, ShieldCheck, User as UserIcon } from 'lucide-react';

type UserRole = 'customer' | 'driver' | 'restaurant';
type UserStatus = 'active' | 'inactive' | 'suspended';

interface UserForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

const emptyForm: UserForm = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'customer',
  status: 'active',
};

export default function AdminUserEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id || '';
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setError('User id is missing');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/admin/users/${userId}`);
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load user');
        }

        setForm({
          id: payload.id,
          name: payload.name || '',
          email: payload.email || '',
          phone: payload.phone || '',
          role: payload.role || 'customer',
          status: payload.status || 'active',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const handleChange = (field: keyof UserForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update user');
      }

      navigate('/admin/users');
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
                onClick={() => navigate('/admin/users')}
                className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#e95322]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to users
              </button>
              <h1 className="text-3xl">Edit User</h1>
              <p className="mt-1 text-gray-600">Update user details from one clean page.</p>
            </div>

            <button
              onClick={() => navigate('/admin/users')}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-8">
          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              Loading user...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-[#fef2ef] p-3 text-[#e95322]">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl">User Details</h2>
                    <p className="text-sm text-gray-500">Edit the main profile information.</p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <label className="block">
                    <div className="mb-2 text-sm text-gray-600">Full name</div>
                    <input
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                      placeholder="Enter full name"
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
                        placeholder="example@gmail.com"
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
                        placeholder="+1 234 567 8901"
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
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl">Access</h2>
                      <p className="text-sm text-gray-500">Control role and account status.</p>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <label className="block">
                      <div className="mb-2 text-sm text-gray-600">Role</div>
                      <select
                        value={form.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                      >
                        <option value="customer">Customer</option>
                        <option value="driver">Driver</option>
                        <option value="restaurant">Restaurant</option>
                      </select>
                    </label>

                    <label className="block">
                      <div className="mb-2 text-sm text-gray-600">Status</div>
                      <select
                        value={form.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#e95322]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="text-sm text-gray-500">User ID</div>
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
