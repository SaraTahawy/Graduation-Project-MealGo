import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Search, Filter, Star, Clock, ShoppingBag, Plus, Minus, X, ChevronRight, Bike } from 'lucide-react';
import { useNavigate } from 'react-router';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  restaurant: string;
  restaurantId: string;
}

interface Restaurant {
  id: string;
  name: string;
  image?: string;
  rating: number;
  ratingCount?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  minOrder?: number;
  distance?: string;
  cuisine?: string[];
  address?: string;
}

interface ReviewItem {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const categories = ['All', 'Pizza', 'Burgers', 'Sushi', 'Pasta', 'Dessert'];

const detectCategory = (item: { category?: string; name: string; description: string }) => {
  const raw = `${item.category || ''} ${item.name} ${item.description}`.toLowerCase();
  if (raw.includes('pizza')) return 'Pizza';
  if (raw.includes('pasta')) return 'Pasta';
  if (raw.includes('burger')) return 'Burgers';
  if (raw.includes('sushi')) return 'Sushi';
  if (raw.includes('dessert') || raw.includes('cake') || raw.includes('ice cream')) return 'Dessert';
  return 'All';
};

export default function CustomerOrdering() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showCart, setShowCart] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurantReviews, setSelectedRestaurantReviews] = useState<ReviewItem[]>([]);

  // Fetch restaurants and menu items
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all restaurants
        const restResponse = await fetch('/api/restaurants');
        if (!restResponse.ok) {
          throw new Error('Failed to load restaurants');
        }
        const restData = await restResponse.json();
        const mappedRestaurants = restData.map((restaurant: any) => ({
            id: restaurant.id,
            name: restaurant.name,
            image: restaurant.image,
            rating: Number(restaurant.rating) || 0,
            ratingCount: Number(restaurant.ratingCount) || 0,
            deliveryTime: restaurant.deliveryTime || '25-35 min',
            deliveryFee: Number(restaurant.deliveryFee) || 2.99,
            minOrder: Number(restaurant.minOrder) || 10,
            distance: restaurant.distance || '1.2 mi',
            cuisine: Array.isArray(restaurant.cuisine) ? restaurant.cuisine : [],
            address: restaurant.address || '',
          }));
        if (!cancelled) {
          setRestaurants(mappedRestaurants);
        }

        // Fetch menu items from all restaurants
        let allItems: MenuItem[] = [];
        for (const restaurant of restData) {
          try {
            const itemsResponse = await fetch(`/api/restaurants/${restaurant.id}/menu/items`);
            if (!itemsResponse.ok) {
              continue;
            }
            const itemsData = await itemsResponse.json();
            const itemsWithRestaurantInfo = itemsData.map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: item.price,
              image: item.image || 'https://images.unsplash.com/photo-1758369636932-36fdcf1314fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
              rating: 4.5,
              category: detectCategory({
                category: item.category || '',
                name: item.name || '',
                description: item.description || '',
              }),
              restaurant: restaurant.name,
              restaurantId: restaurant.id
            }));
            allItems = [...allItems, ...itemsWithRestaurantInfo];
          } catch (err) {
            console.error(`Failed to fetch items for restaurant ${restaurant.id}:`, err);
          }
        }
        if (!cancelled) {
          setMenuItems(allItems);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const intervalId = window.setInterval(fetchData, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const fetchRestaurantReviews = async () => {
      if (!selectedRestaurant) {
        setSelectedRestaurantReviews([]);
        return;
      }

      try {
        const response = await fetch(`/api/restaurants/${selectedRestaurant}/reviews`);
        if (!response.ok) {
          setSelectedRestaurantReviews([]);
          return;
        }
        const data = await response.json();
        setSelectedRestaurantReviews(data.slice(0, 3));
      } catch {
        setSelectedRestaurantReviews([]);
      }
    };

    fetchRestaurantReviews();
  }, [selectedRestaurant]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
                         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRestaurant = !selectedRestaurant || item.restaurantId === selectedRestaurant;
    return matchesCategory && matchesSearch && matchesRestaurant;
  });

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (selectedRestaurant) return restaurant.id === selectedRestaurant;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return restaurant.name.toLowerCase().includes(q) ||
           (restaurant.cuisine && restaurant.cuisine.some(c => c.toLowerCase().includes(q))) ||
           (restaurant.address && restaurant.address.toLowerCase().includes(q));
  });

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartTotal = Object.entries(cart).reduce((total, [itemId, quantity]) => {
    const item = menuItems.find(i => i.id === itemId);
    return total + (item?.price || 0) * quantity;
  }, 0);

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, items: menuItems } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Navbar isLoggedIn={true} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dishes, restaurants..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#e95322] bg-white"
              />
            </div>
            <button className="px-5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#e95322] to-[#ff6b35] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
              Limited Time Offer
            </div>
            <h2 className="text-2xl mb-2">Get 30% off your first order!</h2>
            <p className="text-white/90 mb-4">Use code: WELCOME30</p>
            <button className="bg-white text-[#e95322] px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
              Order Now
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#e95322] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants Section */}
        {!selectedRestaurant && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">Popular Restaurants</h2>
              <button className="text-[#e95322] text-sm hover:underline">See all</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative h-32">
                    <ImageWithFallback
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base mb-2">{restaurant.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{restaurant.deliveryTime}</span>
                      <span>|</span>
                      <span>{restaurant.distance}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(restaurant.cuisine ?? []).join(' | ') || 'Various cuisines'}
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {restaurant.ratingCount ? `${restaurant.ratingCount} ratings` : 'No ratings yet'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Restaurant Header */}
        {selectedRestaurant && (
          <div className="mb-6">
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="text-[#e95322] text-sm mb-4 hover:underline"
            >
              Back to all restaurants
            </button>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl mb-2">
                    {restaurants.find(r => r.id === selectedRestaurant)?.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{(restaurants.find(r => r.id === selectedRestaurant)?.rating || 0).toFixed(1)}</span>
                    </div>
                    <span>|</span>
                    <span>{restaurants.find(r => r.id === selectedRestaurant)?.deliveryTime}</span>
                    <span>|</span>
                    <span>${restaurants.find(r => r.id === selectedRestaurant)?.deliveryFee} delivery</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Customer Reviews</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{(restaurants.find(r => r.id === selectedRestaurant)?.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              {selectedRestaurantReviews.length > 0 ? (
                <div className="space-y-4">
                  {selectedRestaurantReviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm">{review.customer}</div>
                          <div className="mt-1 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={`${review.id}-${index}`}
                                className={`w-4 h-4 ${index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{review.comment || 'No written feedback'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No reviews yet for this restaurant.</div>
              )}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div>
          <h2 className="text-xl mb-4">
            {selectedRestaurant ? 'Menu' : 'Popular Dishes'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{item.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  {!selectedRestaurant && (
                    <p className="text-xs text-gray-500 mb-3">{item.restaurant}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl text-[#e95322]">${item.price}</span>
                    {cart[item.id] ? (
                      <div 
                        className="flex items-center gap-3 bg-[#e95322] rounded-full px-3 py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white hover:scale-110 transition-transform"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white min-w-[20px] text-center">{cart[item.id]}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="text-white hover:scale-110 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item.id);
                        }}
                        className="bg-[#e95322] text-white p-2 rounded-full hover:bg-[#d14719] transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-[#e95322] text-white py-4 rounded-2xl hover:bg-[#d14719] transition-all shadow-lg flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white">{cartItemCount} items</span>
                </div>
                <span className="text-lg">View Cart</span>
              </div>
              <span className="text-xl">${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-end">
          <div
            className="absolute inset-0"
            onClick={() => setShowCart(false)}
          />
          <div className="relative bg-white w-full sm:w-[450px] sm:h-full sm:max-h-screen rounded-t-3xl sm:rounded-none overflow-hidden flex flex-col animate-slide-up">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {Object.entries(cart).length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = menuItems.find(i => i.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} className="flex items-center gap-4 pb-4 border-b border-gray-100">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-base mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.restaurant}</p>
                          <div className="text-[#e95322]">${item.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => addToCart(itemId)}
                            className="w-8 h-8 rounded-full bg-[#e95322] text-white flex items-center justify-center hover:bg-[#d14719]"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {Object.entries(cart).length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>$2.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span>$0.99</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#e95322]">${(cartTotal + 2.99 + 0.99).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#e95322] text-white py-4 rounded-2xl hover:bg-[#d14719] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
            
            <ImageWithFallback
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-2xl mb-2">{selectedItem.name}</h2>
                <p className="text-gray-600 mb-3">{selectedItem.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedItem.rating}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{selectedItem.restaurant}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm text-gray-600 mb-2">Special Instructions</h3>
                <textarea
                  placeholder="Add a note (e.g., no onions, extra sauce)"
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-[#e95322]"
                  rows={3}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Price</div>
                  <div className="text-2xl text-[#e95322]">${selectedItem.price}</div>
                </div>
                <div className="flex items-center gap-4">
                  {cart[selectedItem.id] ? (
                    <>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                        <button
                          onClick={() => removeFromCart(selectedItem.id)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="min-w-[20px] text-center text-lg">{cart[selectedItem.id]}</span>
                        <button
                          onClick={() => addToCart(selectedItem.id)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="bg-[#e95322] text-white px-8 py-3 rounded-full hover:bg-[#d14719] transition-colors"
                      >
                        Done
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        addToCart(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="bg-[#e95322] text-white px-8 py-3 rounded-full hover:bg-[#d14719] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
