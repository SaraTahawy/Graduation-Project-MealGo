import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Star, Clock, Shield, Users, Truck, ChefHat, X, Store, TruckIcon, ShieldCheck, Utensils } from 'lucide-react';

export default function Home() {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const navigate = useNavigate();

  const handlePartnerSelect = (role: string) => {
    navigate('/signup');
  };

  const handleStartOrdering = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors dark:bg-black dark:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-[#ffdecf] rounded-full px-6 py-3 mb-8">
              <Star className="w-5 h-5 text-[#e95322] fill-[#e95322]" />
              <span className="text-[#e95322]">Rated 4.8/5 by 50,000+ customers</span>
            </div>
            
            <h1 className="text-5xl mb-6">
              Your Favorite Food,<br />Delivered Fast
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed dark:text-gray-300">
              Order from thousands of top-rated restaurants in your area. Track your delivery in real-time and enjoy fresh, delicious meals in 30 minutes or less.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => handleStartOrdering()}
                className="bg-[#e95322] text-white px-8 py-4 rounded-2xl shadow-lg hover:bg-[#d14719] transition-all flex items-center gap-2"
              >
                Start Ordering Now
                <span className="ml-2">â†’</span>
              </button>
              <button
                onClick={() => setShowAccountModal(true)}
                className="border-2 border-[#e95322] text-[#e95322] px-8 py-4 rounded-2xl hover:bg-[#fef2ef] transition-all dark:hover:bg-gray-900"
              >
                Become a Partner
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl mb-1">1,000+</div>
                <div className="text-gray-600 dark:text-gray-300">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl mb-1">50K+</div>
                <div className="text-gray-600 dark:text-gray-300">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl mb-1">100K+</div>
                <div className="text-gray-600 dark:text-gray-300">Deliveries</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1654683413645-d8d15189384c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBtb2JpbGUlMjBwaG9uZSUyMGFwcCUyMGhhbmR8ZW58MXx8fHwxNzcwOTMyNjgxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Food Delivery App"
              className="rounded-3xl w-full shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Why Choose MealGo?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Experience the best in food delivery</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8 text-[#e95322]" />,
                title: 'Fast Delivery',
                description: 'Get your food delivered in 30 minutes or less'
              },
              {
                icon: <Shield className="w-8 h-8 text-[#e95322]" />,
                title: 'Safe & Secure',
                description: 'Your payment and data are always protected'
              },
              {
                icon: <Star className="w-8 h-8 text-[#e95322]" />,
                title: 'Top Rated',
                description: 'Only the best restaurants on our platform'
              },
              {
                icon: <Users className="w-8 h-8 text-[#e95322]" />,
                title: '24/7 Support',
                description: 'We are here to help you anytime'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center dark:bg-gray-900 dark:border dark:border-gray-800">
                <div className="bg-[#fef2ef] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Three simple steps to get your food</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Browse & Select',
                description: 'Choose from thousands of restaurants and menu items',
                color: '#e95322'
              },
              {
                step: '02',
                title: 'Place Order',
                description: 'Add items to cart and checkout securely',
                color: '#ff6b35'
              },
              {
                step: '03',
                title: 'Track & Enjoy',
                description: 'Real-time tracking until delivery',
                color: '#ff8f6b'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div
                    className="text-7xl mb-6 opacity-20"
                    style={{ color: step.color }}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-2xl mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-lg dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section id="partners" className="bg-[#e95322] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-6">Ready to Become a Partner?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of restaurants and drivers earning with MealGo. Start your journey today!
          </p>
          <button
            onClick={() => setShowAccountModal(true)}
            className="bg-white text-[#e95322] px-10 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#e95322] rounded-xl p-2">
                  <ChefHat className="w-6 h-6" />
                </div>
                <span className="text-xl">MealGo</span>
              </div>
              <p className="text-gray-400">
                Delivering happiness, one meal at a time.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Safety</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>Â© 2026 MealGo. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Account Type Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative dark:bg-gray-950 dark:text-white dark:border dark:border-gray-800">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl mb-2">Choose Your Account Type</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-300">Select how you'd like to use MealGo</p>

            <div className="space-y-4">
              <button
                onClick={() => handlePartnerSelect('restaurant')}
                className="block w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-[#e95322] hover:bg-[#fef2ef] transition-all text-left dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#fef2ef] p-4 rounded-xl">
                    <Store className="w-8 h-8 text-[#e95322]" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-1">Restaurant Partner</h3>
                    <p className="text-gray-600 dark:text-gray-300">Manage orders and grow business</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handlePartnerSelect('driver')}
                className="block w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-[#e95322] hover:bg-[#fef2ef] transition-all text-left dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#fef2ef] p-4 rounded-xl">
                    <TruckIcon className="w-8 h-8 text-[#e95322]" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-1">Delivery Driver</h3>
                    <p className="text-gray-600 dark:text-gray-300">Earn by delivering orders</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
