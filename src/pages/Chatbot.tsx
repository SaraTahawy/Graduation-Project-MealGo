import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m MealGo Assistant. How can I help you today? You can ask me about your orders, menu items, account, or anything related to MealGo.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Get user data
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userName = user?.name || 'there';

    // Get orders
    const storageKey = `mealgo_orders_${user?.id || 'guest'}`;
    const storedOrders = localStorage.getItem(storageKey);
    const orders = storedOrders ? JSON.parse(storedOrders) : [];

    // Responses based on keywords
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello ${userName}! Welcome to MealGo. How can I assist you today?`;
    }

    if (message.includes('order') && (message.includes('my') || message.includes('status') || message.includes('track'))) {
      if (orders.length === 0) {
        return "You don't have any orders yet. Would you like me to help you place your first order?";
      }
      const recentOrder = orders[0];
      return `Your most recent order (${recentOrder.orderNumber}) is ${recentOrder.status}. You can track it in the Orders page. You have ${orders.length} total orders.`;
    }

    if (message.includes('menu') || message.includes('food') || message.includes('dish')) {
      return "You can browse our menu by going to 'Order Food' in the navigation. We have various cuisines including American, Italian, Japanese, and more. What type of food are you in the mood for?";
    }

    if (message.includes('profile') || message.includes('account') || message.includes('name') || message.includes('email')) {
      return `Your profile information: Name: ${user?.name || 'Not set'}, Email: ${user?.email || 'Not set'}. You can update this in the Profile page.`;
    }

    if (message.includes('wallet') || message.includes('coupon') || message.includes('discount')) {
      return "You can connect your wallet and view your NFT coupons in the Profile page. This allows you to redeem special discounts on your orders.";
    }

    if (message.includes('delivery') || message.includes('time') || message.includes('address')) {
      return "Our delivery times vary by restaurant, typically 25-45 minutes. You can set your delivery address in your profile or during checkout.";
    }

    if (message.includes('payment') || message.includes('pay')) {
      return "We accept various payment methods including credit cards, PayPal, and Apple Pay. You can also use NFT coupons for discounts.";
    }

    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! You can ask me about:\n• Your orders and tracking\n• Menu items and restaurants\n• Account and profile settings\n• Payment and wallet\n• Delivery information\n• General app usage";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    if (message.includes('bye') || message.includes('goodbye')) {
      return "Goodbye! Have a great day with MealGo. 🍕";
    }

    // Default response
    return "I'm not sure I understand that. Can you please rephrase your question? You can ask about orders, menu, profile, wallet, delivery, or general help.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#e95322] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">MealGo Assistant</h1>
                <p className="text-white/80 text-sm">Your personal food ordering assistant</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-[#e95322] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-[#e95322] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-[#e95322] rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322]"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-6 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ask about orders, menu, profile, wallet, delivery, or general help
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
