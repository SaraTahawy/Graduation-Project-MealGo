export type AppRole = 'customer' | 'driver' | 'restaurant' | 'admin';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  phone?: string | null;
  restaurantId?: string | null;
  restaurantName?: string | null;
  driverId?: string | null;
}

const getRoleSessionKey = (role: AppRole) => `mealgo_last_session_${role}`;

export const setCurrentUserSession = (user: StoredUser) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem(getRoleSessionKey(user.role), JSON.stringify(user));
  window.dispatchEvent(new Event('userChanged'));
};

export const getCurrentUserSession = (): StoredUser | null => {
  const raw = localStorage.getItem('currentUser');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getRoleSession = (role: AppRole): StoredUser | null => {
  const raw = localStorage.getItem(getRoleSessionKey(role));
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getActiveRoleSession = (role: AppRole): StoredUser | null => {
  const currentUser = getCurrentUserSession();
  if (currentUser?.role === role) {
    return currentUser;
  }

  return getRoleSession(role);
};

export const hydrateRoleSession = async (role: AppRole): Promise<StoredUser | null> => {
  const user = getActiveRoleSession(role);
  if (!user?.email) return user;

  const needsHydration =
    !user.phone ||
    (role === 'restaurant' && (!user.restaurantId || !user.restaurantName)) ||
    (role === 'driver' && !user.driverId);

  if (!needsHydration) return user;

  try {
    const response = await fetch('/api/auth/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, role }),
    });

    if (!response.ok) return user;

    const authUser = await response.json();
    const hydratedUser: StoredUser = {
      ...user,
      id: authUser.id ?? user.id,
      name: authUser.name ?? user.name,
      email: authUser.email ?? user.email,
      role: authUser.role ?? user.role,
      phone: authUser.phone ?? user.phone ?? null,
      restaurantId: authUser.restaurantId ?? user.restaurantId ?? null,
      restaurantName: authUser.restaurantName ?? user.restaurantName ?? null,
      driverId: authUser.driverId ?? user.driverId ?? null,
    };

    setCurrentUserSession(hydratedUser);
    return hydratedUser;
  } catch {
    return user;
  }
};

export const clearRoleSession = (role: AppRole) => {
  const currentUser = getCurrentUserSession();
  if (currentUser?.role === role) {
    localStorage.removeItem('currentUser');
  }
  localStorage.removeItem(getRoleSessionKey(role));
  window.dispatchEvent(new Event('userChanged'));
};
