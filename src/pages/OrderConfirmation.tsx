import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChefHat, Check, Clock, Shield, Users, ArrowLeft } from 'lucide-react';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};
  const storedUser = localStorage.getItem('currentUser');
  const userId = storedUser ? JSON.parse(storedUser).id : null;
  const lastOrderNumber = (userId && localStorage.getItem(`mealgo_last_order_number_${userId}`))
    || localStorage.getItem('mealgo_last_order_number');

  const orderNumber = orderData.orderNumber || lastOrderNumber || 'FH123456';
  const estimatedTime = orderData.estimatedTime || '08:04 AM';
  const deliveryMinutes = orderData.deliveryMinutes || '25-35 minutes';
  const deliveryAddress = orderData.deliveryAddress || 'Jl. Soekarno Hatta 15A M';
  const deliveryCity = orderData.deliveryCity || 'Bandung, Indonesia';
  const totalAmount = orderData.totalAmount || 68.67;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#e95322] rounded-xl p-2">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">MealGo</span>
            </div>
            <button
              onClick={() => navigate('/order')}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-[#e95322] hover:text-[#e95322]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#fef2ef] rounded-full mb-6">
              <div className="w-12 h-12 bg-[#e95322] rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
            
            <h1 className="text-4xl mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">Thank you for your order. Your food is being prepared.</p>
          </div>

          {/* Order Number */}
          <div className="bg-[#ffdecf] rounded-2xl p-6 text-center max-w-xs mx-auto">
            <div className="text-sm text-gray-600 mb-2">Order Number</div>
            <div className="text-3xl text-[#e95322]">{orderNumber}</div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#fef2ef] rounded-2xl p-4">
              <Clock className="w-8 h-8 text-[#e95322]" />
            </div>
            <div>
              <h3 className="text-lg mb-1">Estimated Delivery</h3>
              <div className="text-xl text-[#e95322] mb-1">{estimatedTime}</div>
              <div className="text-sm text-gray-600">{deliveryMinutes}</div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-xl mb-6">Order Summary</h3>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="text-gray-600 mb-4">Delivery to:</div>
            <div className="mb-2">{deliveryAddress}</div>
            <div className="text-sm text-gray-600">{deliveryCity}</div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xl">Total Paid</span>
              <span className="text-2xl text-[#e95322]">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Track Order Button */}
        <button
          onClick={() => navigate(`/order-tracking?orderNumber=${encodeURIComponent(orderNumber)}`, { state: { orderNumber } })}
          className="w-full bg-[#e95322] text-white py-4 rounded-2xl text-lg hover:bg-[#d14719] transition-colors shadow-lg mb-6"
        >
          Track Order
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="bg-[#fef2ef] rounded-xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-[#e95322]" />
            </div>
            <div className="text-sm text-gray-600">Safe & Secure</div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/chatbot')}
            className="bg-white rounded-2xl shadow-sm p-6 text-center hover:bg-[#fef2ef] transition-colors"
          >
            <div className="bg-[#fef2ef] rounded-xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-[#e95322]" />
            </div>
            <div className="text-sm text-gray-600">24/7 Support</div>
          </button>
        </div>
      </div>
    </div>
  );
}
