import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Search, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { hydrateRoleSession, setCurrentUserSession } from '../utils/session';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string | null;
  categoryId?: string;
  image?: string;
  available: boolean;
}

const detectMenuCategory = (item: MenuItem) => {
  if (item.category && item.category.trim()) return item.category.trim();

  const raw = `${item.categoryId || ''} ${item.name || ''} ${item.description || ''}`.toLowerCase();
  if (raw.includes('pasta')) return 'Pasta';
  if (raw.includes('pizza')) return 'Pizza';
  if (raw.includes('burger')) return 'Burgers';
  if (raw.includes('sushi')) return 'Sushi';
  if (raw.includes('dessert') || raw.includes('cake')) return 'Dessert';
  if (raw.includes('coffee')) return 'Coffee';
  if (raw.includes('korean')) return 'Korean';
  return 'General';
};

export default function RestaurantMenu() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '' });
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Get restaurant ID from localStorage
  useEffect(() => {
    let isMounted = true;

    const loadRestaurantSession = async () => {
      const user = await hydrateRoleSession('restaurant');
      if (!isMounted) return;

      if (user) {
        setCurrentUserSession(user);
        setRestaurantId(user.restaurantId || '77777777-7777-7777-7777-777777777771');
        return;
      }

      setRestaurantId('77777777-7777-7777-7777-777777777771');
    };

    loadRestaurantSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch menu items
  useEffect(() => {
    if (!restaurantId) return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/restaurants/${restaurantId}/menu/items`);
        const data = await response.json();
        setItems(data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          categoryId: item.categoryId,
          image: item.image,
          available: item.available
        })));
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [restaurantId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Name and price are required');
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/menu/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image,
          available: true
        })
      });

      const newItem = await response.json();
      setItems([newItem, ...items]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', price: '', image: '' });
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item');
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formData.name || !formData.price) {
      alert('Name and price are required');
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/menu/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image
        })
      });

      const updatedItem = await response.json();
      setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', image: '' });
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`/api/restaurants/${restaurantId}/menu/items/${id}`, {
        method: 'DELETE'
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/menu/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available })
      });

      const updatedItem = await response.json();
      setItems(items.map(i => i.id === item.id ? { ...i, available: updatedItem.available } : i));
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const detectedCategory = detectMenuCategory(item);
    const matchesCategory = selectedCategory === 'All' || detectedCategory === selectedCategory;
    const matchesSearch = item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...Array.from(new Set(items.map((item) => detectMenuCategory(item)).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="restaurant" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/restaurant/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl">Menu Management</h1>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ name: '', description: '', price: '', image: '' });
              setShowAddModal(true);
            }}
            className="bg-[#e95322] text-white px-6 py-3 rounded-xl hover:bg-[#d14719] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#e95322]"
            />
          </div>

          <div className="flex gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-[#e95322] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Loading menu items...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-6">
                {/* Image */}
                <div className="relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs px-2 py-1 bg-red-500 rounded">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description || 'No description'}</p>
                </div>

                {/* Price */}
                <div className="text-2xl text-[#e95322]">
                  ${item.price.toFixed(2)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleAvailability(item)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      item.available ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        item.available ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setFormData({
                        name: item.name,
                        description: item.description || '',
                        price: item.price.toString(),
                        image: item.image || ''
                      });
                      setShowAddModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl mb-6">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>

            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Item description..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 12.99"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
