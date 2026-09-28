import { useEffect, useState } from 'react';
import { useWalletCoupons } from '../hooks/useWallet';
import { useLocation, useNavigate } from 'react-router';
import { Minus, Plus, CreditCard, Tag, ChefHat, Phone, Wallet, LockKeyhole, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getCurrentUserSession, getRoleSession, setCurrentUserSession, type StoredUser } from '../utils/session';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  restaurantId?: string;
  restaurant?: string;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

type PaymentMethod = 'card' | 'cash';

interface CheckoutLocationState {
  cart?: Record<string, number>;
  items?: MenuItem[];
}

const phoneRegex = /^[0-9+\-\s()]{8,20}$/;

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as CheckoutLocationState) || {};
  const cart = state.cart || {};
  const items = state.items || [];

  const [orderItems, setOrderItems] = useState<OrderItem[]>(() =>
    Object.entries(cart)
      .map(([itemId, quantity]) => {
        const item = items.find((menuItem) => menuItem.id === itemId);
        if (!item) return null;
        return {
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity,
        };
      })
      .filter((item): item is OrderItem => item !== null)
  );

  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() => {
    const stored = getCurrentUserSession();
    if (stored?.role === 'customer') {
      return stored;
    }

    return getRoleSession('customer');
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ discountType: string; discountValue: number } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { walletAddress, connectWallet } = useWalletCoupons();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (orderItems.length === 0) {
      navigate('/order');
    }
  }, [navigate, orderItems.length]);

  useEffect(() => {
    const syncCustomerSession = () => {
      const stored = getCurrentUserSession();
      const customerSession = getRoleSession('customer');
      const resolvedUser =
        stored?.role === 'customer'
          ? stored
          : customerSession?.role === 'customer'
          ? customerSession
          : null;

      if (resolvedUser && stored?.id !== resolvedUser.id) {
        setCurrentUserSession(resolvedUser);
      }

      setCurrentUser(resolvedUser);
    };

    syncCustomerSession();
    window.addEventListener('userChanged', syncCustomerSession);
    window.addEventListener('storage', syncCustomerSession);
    window.addEventListener('focus', syncCustomerSession);
    document.addEventListener('visibilitychange', syncCustomerSession);

    return () => {
      window.removeEventListener('userChanged', syncCustomerSession);
      window.removeEventListener('storage', syncCustomerSession);
      window.removeEventListener('focus', syncCustomerSession);
      document.removeEventListener('visibilitychange', syncCustomerSession);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setPhone((existingPhone) => existingPhone || currentUser.phone || '');
  }, [currentUser]);

  const restaurantName = items.find((item) => item.restaurant)?.restaurant || currentUser?.name || 'Checkout';

  const updateQuantity = (id: string, change: number) => {
    setOrderItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 4.99;

  let discount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.discountType === 'percentage') {
      discount = subtotal * (appliedDiscount.discountValue / 100);
    } else if (appliedDiscount.discountType === 'fixed') {
      discount = appliedDiscount.discountValue;
    } else if (appliedDiscount.discountType === 'free_delivery') {
      discount = deliveryFee;
    }
  }

  const subtotalAfterDiscount = subtotal - discount;
  const tax = subtotalAfterDiscount * 0.08;
  const total = subtotalAfterDiscount + deliveryFee + tax;

  const validateCardDetails = () => {
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!cardName.trim()) return 'Please enter the name on the card';
    if (cleanedCardNumber.length !== 16) return 'Card number must be 16 digits';
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return 'Expiry date must be in MM/YY format';
    const [monthText, yearText] = expiryDate.split('/');
    const month = Number(monthText);
    const year = Number(`20${yearText}`);
    if (month < 1 || month > 12) return 'Expiry month must be between 01 and 12';
    const expiry = new Date(year, month, 0, 23, 59, 59, 999);
    if (Number.isNaN(expiry.getTime()) || expiry < new Date()) return 'Card expiry date is invalid';
    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
    return null;
  };

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promo code');
      return;
    }
    if (!walletAddress) {
      alert('Please connect your wallet before applying a coupon');
      return;
    }

    setApplyingCoupon(true);
    try {
      const response = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          walletAddress,
          userId: currentUser?.id || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(error.message || 'Failed to apply coupon');
        return;
      }

      const data = await response.json();
      setAppliedDiscount({
        discountType: data.discountType,
        discountValue: data.discountValue,
      });
      alert('Coupon applied successfully');
    } catch {
      alert('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser?.id || currentUser?.role !== 'customer') {
      alert('Please sign in as a customer before placing an order');
      navigate('/signin', { state: { selectedRole: 'customer' } });
      return;
    }

    if (!phoneRegex.test(phone.trim())) {
      alert('Please enter a valid phone number');
      return;
    }

    if (!addressLine1.trim() || !city.trim() || !stateRegion.trim() || !postalCode.trim()) {
      alert('Please complete your delivery address');
      return;
    }

    if (paymentMethod === 'card') {
      const cardError = validateCardDetails();
      if (cardError) {
        alert(cardError);
        return;
      }
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser.id,
          customerEmail: currentUser.email || null,
          items: orderItems.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
          paymentMethod,
          promoCode: promoCode.trim() || null,
          deliveryLine1: addressLine1.trim(),
          deliveryCity: city.trim(),
          deliveryState: stateRegion.trim(),
          deliveryPostalCode: postalCode.trim(),
          deliveryCountryCode: 'US',
          deliveryNotes: `Phone: ${phone.trim()}`,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to place order');
      }

      const orderNumber = payload.orderNumber || ('FH' + Math.floor(100000 + Math.random() * 900000));
      const date = new Date().toLocaleDateString();
      const deliveryAddress = `${addressLine1.trim()}, ${city.trim()}`;
      const order = {
        id: payload.id || orderNumber,
        orderNumber,
        date,
        restaurant: restaurantName,
        items: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        total,
        status: 'in-progress',
        deliveryAddress,
        estimatedTime: '25-35 min',
        deliveryMinutes: '25-35 minutes',
        paymentMethod,
        promoCode,
        appliedDiscount,
        orderItems,
      };

      const storageKey = `mealgo_orders_${currentUser.id}`;
      const existingOrdersJson = localStorage.getItem(storageKey);
      const existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
      localStorage.setItem(storageKey, JSON.stringify([order, ...existingOrders]));
      localStorage.setItem(`mealgo_last_order_number_${currentUser.id}`, orderNumber);
      localStorage.setItem('mealgo_last_order_number', orderNumber);

      navigate('/order-confirmation', {
        state: {
          orderNumber,
          totalAmount: payload.total || total,
          total: payload.total || total,
          orderItems,
          estimatedTime: order.estimatedTime,
          deliveryMinutes: order.deliveryMinutes,
          deliveryAddress,
          deliveryCity: city.trim(),
          paymentMethod,
          promoCode,
          appliedDiscount,
        },
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to place order');
    }
  };

  if (orderItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f6f1ea] pb-36">
      <header className="border-b border-[#eadfd2] bg-[#fffaf5]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e95322]">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-[14px] uppercase tracking-[0.2em] text-[#b07b5f]">Checkout</div>
              <div className="text-[22px] text-[#1f1611]">Complete your order</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/order')}
            className="inline-flex items-center gap-2 rounded-full border border-[#dbcabb] bg-white px-4 py-2 text-[14px] text-[#6e5a4d] transition hover:border-[#e95322] hover:text-[#e95322]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#eadfd2] bg-[#fffaf5] p-6 shadow-[0_10px_30px_rgba(97,61,34,0.06)]">
            <div className="mb-5">
              <p className="text-[13px] uppercase tracking-[0.18em] text-[#b07b5f]">Deliver To</p>
              <h1 className="mt-2 text-[28px] leading-tight text-[#1f1611]">Where should we bring your order?</h1>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-[14px] text-[#6e5a4d]">Street address</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street, building, apartment"
                  className="w-full rounded-2xl border border-[#dbcabb] bg-white px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[14px] text-[#6e5a4d]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full rounded-2xl border border-[#dbcabb] bg-white px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[14px] text-[#6e5a4d]">State</label>
                  <input
                    type="text"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    placeholder="State"
                    className="w-full rounded-2xl border border-[#dbcabb] bg-white px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[14px] text-[#6e5a4d]">ZIP code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="ZIP"
                    className="w-full rounded-2xl border border-[#dbcabb] bg-white px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadfd2] bg-[#fffaf5] p-6 shadow-[0_10px_30px_rgba(97,61,34,0.06)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] uppercase tracking-[0.18em] text-[#b07b5f]">Your Order</p>
                <h2 className="mt-2 text-[24px] text-[#1f1611]">{restaurantName}</h2>
              </div>
              <div className="rounded-full bg-[#fbe1d4] px-4 py-2 text-[14px] text-[#d55828]">
                {orderItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </div>
            </div>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-3xl border border-[#f1e4d7] bg-white p-4">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-[18px] text-[#1f1611]">{item.name}</h3>
                      <p className="mt-2 text-[18px] text-[#e95322]">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#f7efe8] px-2 py-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3c7b3] bg-white text-[#e95322] transition hover:bg-[#fff3ed]"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-[16px] text-[#1f1611]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e95322] text-white transition hover:bg-[#d84a1d]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadfd2] bg-[#fffaf5] p-6 shadow-[0_10px_30px_rgba(97,61,34,0.06)]">
            <div className="mb-5">
              <p className="text-[13px] uppercase tracking-[0.18em] text-[#b07b5f]">Contact</p>
              <h2 className="mt-2 text-[24px] text-[#1f1611]">How can we reach you?</h2>
            </div>

            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b07b5f]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full rounded-2xl border border-[#dbcabb] bg-white py-3 pl-12 pr-4 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
              />
            </div>
            <p className="mt-3 text-[13px] text-[#8b7464]">Use a valid number so the driver can contact you if needed.</p>
          </section>

          <section className="rounded-[28px] border border-[#eadfd2] bg-[#fffaf5] p-6 shadow-[0_10px_30px_rgba(97,61,34,0.06)]">
            <div className="mb-5">
              <p className="text-[13px] uppercase tracking-[0.18em] text-[#b07b5f]">Payment</p>
              <h2 className="mt-2 text-[24px] text-[#1f1611]">Choose how you want to pay</h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  paymentMethod === 'card'
                    ? 'border-[#e95322] bg-[#fff1ea] shadow-[0_10px_24px_rgba(233,83,34,0.12)]'
                    : 'border-[#dbcabb] bg-white hover:border-[#e0b79f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                    <CreditCard className="h-5 w-5 text-[#1f1611]" />
                  </div>
                  <div>
                    <div className="text-[17px] text-[#1f1611]">Visa</div>
                    <div className="text-[14px] text-[#7b6658]">Pay securely with your card</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  paymentMethod === 'cash'
                    ? 'border-[#e95322] bg-[#fff1ea] shadow-[0_10px_24px_rgba(233,83,34,0.12)]'
                    : 'border-[#dbcabb] bg-white hover:border-[#e0b79f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                    <Wallet className="h-5 w-5 text-[#1f1611]" />
                  </div>
                  <div>
                    <div className="text-[17px] text-[#1f1611]">Cash</div>
                    <div className="text-[14px] text-[#7b6658]">Pay when your order arrives</div>
                  </div>
                </div>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-5 rounded-3xl border border-[#f0d9ca] bg-white p-5">
                <div className="mb-4 flex items-center gap-2 text-[#7b6658]">
                  <LockKeyhole className="h-4 w-4" />
                  <span className="text-[13px]">Encrypted card details</span>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-[14px] text-[#6e5a4d]">Name on card</label>
                    <input
                      type="text"
                      name="checkout-cardholder"
                      autoComplete="off"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Sara Nabil"
                      className="w-full rounded-2xl border border-[#dbcabb] bg-[#fffaf5] px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[14px] text-[#6e5a4d]">Card number</label>
                    <input
                      type="text"
                      name="checkout-card-number"
                      autoComplete="off"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-2xl border border-[#dbcabb] bg-[#fffaf5] px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[14px] text-[#6e5a4d]">Expiry</label>
                      <input
                        type="text"
                        name="checkout-card-expiry"
                        autoComplete="off"
                        inputMode="numeric"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className="w-full rounded-2xl border border-[#dbcabb] bg-[#fffaf5] px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[14px] text-[#6e5a4d]">CVV</label>
                      <input
                        type="password"
                        name="checkout-card-cvv"
                        autoComplete="off"
                        inputMode="numeric"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className="w-full rounded-2xl border border-[#dbcabb] bg-[#fffaf5] px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-[#eadfd2] bg-[#fffaf5] p-6 shadow-[0_10px_30px_rgba(97,61,34,0.06)]">
            <div className="mb-4 flex items-center gap-3">
              <Tag className="h-5 w-5 text-[#e95322]" />
              <div>
                <p className="text-[13px] uppercase tracking-[0.18em] text-[#b07b5f]">Coupon</p>
                <h2 className="mt-1 text-[24px] text-[#1f1611]">Add your promo code</h2>
              </div>
            </div>

            {!walletAddress && (
              <div className="mb-4 rounded-2xl border border-[#f1cabb] bg-[#fff1ea] p-4">
                <p className="text-[14px] text-[#8d4e34]">Connect your wallet first if your promo code depends on wallet coupons.</p>
                <button
                  onClick={connectWallet}
                  className="mt-3 rounded-xl bg-[#e95322] px-4 py-2 text-sm text-white transition hover:bg-[#d84a1d]"
                >
                  Connect Wallet
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                placeholder="Enter promo code"
                disabled={applyingCoupon || !walletAddress}
                className="flex-1 rounded-2xl border border-[#dbcabb] bg-white px-4 py-3 text-[16px] text-[#1f1611] outline-none transition focus:border-[#e95322] focus:ring-4 focus:ring-[#f9d7c9] disabled:bg-[#f3eee8]"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={applyingCoupon || !walletAddress}
                className="rounded-2xl bg-[#e95322] px-6 py-3 text-[16px] text-white transition hover:bg-[#d84a1d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyingCoupon ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[28px] border border-[#eadfd2] bg-[#fffaf5] p-6 shadow-[0_10px_30px_rgba(97,61,34,0.06)] lg:sticky lg:top-6">
          <div className="mb-5">
            <p className="text-[13px] uppercase tracking-[0.18em] text-[#b07b5f]">Summary</p>
            <h2 className="mt-2 text-[24px] text-[#1f1611]">Order Summary</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[16px] text-[#6f5b4f]">
              <span>Subtotal</span>
              <span className="text-[#1f1611]">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[16px] text-green-700">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[16px] text-[#6f5b4f]">
              <span>Delivery Fee</span>
              <span className="text-[#1f1611]">${(appliedDiscount?.discountType === 'free_delivery' ? 0 : deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[16px] text-[#6f5b4f]">
              <span>Tax (8%)</span>
              <span className="text-[#1f1611]">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-[#eadfd2] pt-4">
              <div className="flex justify-between text-[22px] text-[#1f1611]">
                <span>Total</span>
                <span className="text-[#e95322]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full rounded-[20px] bg-[#e95322] px-6 py-4 text-[18px] text-white shadow-[0_16px_30px_rgba(233,83,34,0.24)] transition hover:bg-[#d84a1d]"
          >
            Place Order - ${total.toFixed(2)}
          </button>

          <div className="mt-4 rounded-2xl bg-[#f8efe7] p-4 text-[14px] text-[#7b6658]">
            Double-check your phone, address, and payment details before confirming.
          </div>
        </aside>
      </div>
    </div>
  );
}
