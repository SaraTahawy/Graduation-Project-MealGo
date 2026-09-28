import { useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, MessageCircle, Clock, Eye } from 'lucide-react';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  customer: string;
  customerEmail: string;
  category: 'order-issue' | 'payment' | 'delivery' | 'account' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdate: string;
  assignedTo?: string;
  messages: number;
}

export default function AdminSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Ticket['status']>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Ticket['priority']>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('status', statusFilter);
      params.set('priority', priorityFilter);
      const response = await fetch(`/api/admin/support?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch support tickets');
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchTickets, 250);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }), [tickets]);

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'urgent': return 'bg-red-100 text-red-700';
    }
  };

  const getCategoryLabel = (category: Ticket['category']) => {
    switch (category) {
      case 'order-issue': return 'Order';
      case 'payment': return 'Payment';
      case 'delivery': return 'Delivery';
      case 'account': return 'Account';
      case 'technical': return 'Tech';
      case 'other': return 'Other';
    }
  };

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-1">Support Tickets</h1>
              <p className="text-gray-600">Manage customer support requests</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-700">{stats.open} Open Tickets</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200"><div className="text-sm text-gray-600 mb-1">Total</div><div className="text-3xl">{stats.total}</div></div>
            <div className="bg-white rounded-xl p-6 border border-gray-200"><div className="text-sm text-gray-600 mb-1">Open</div><div className="text-3xl text-yellow-600">{stats.open}</div></div>
            <div className="bg-white rounded-xl p-6 border border-gray-200"><div className="text-sm text-gray-600 mb-1">In Progress</div><div className="text-3xl text-blue-600">{stats.inProgress}</div></div>
            <div className="bg-white rounded-xl p-6 border border-gray-200"><div className="text-sm text-gray-600 mb-1">Resolved</div><div className="text-3xl text-green-600">{stats.resolved}</div></div>
            <div className="bg-white rounded-xl p-6 border border-gray-200"><div className="text-sm text-gray-600 mb-1">Closed</div><div className="text-3xl text-gray-600">{stats.closed}</div></div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets by ID, subject, or customer..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#e95322] transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`px-6 py-2 rounded-full transition-all text-sm ${
                    statusFilter === status ? 'bg-[#e95322] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <span className="text-sm text-gray-600 py-2 px-2">Priority:</span>
              {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority as typeof priorityFilter)}
                  className={`px-4 py-2 rounded-full transition-all text-sm ${
                    priorityFilter === priority ? 'bg-[#e95322] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>}
          {isLoading && <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 mb-6"><p className="text-gray-500">Loading tickets...</p></div>}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Ticket</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Subject</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Customer</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Category</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Priority</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Assigned To</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Last Update</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={ticket.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index === tickets.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="text-sm text-[#e95322]">{ticket.ticketNumber}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageCircle className="w-3 h-3" />{ticket.messages}
                        </div>
                      </td>
                      <td className="py-4 px-6"><div className="text-sm max-w-xs truncate">{ticket.subject}</div></td>
                      <td className="py-4 px-6"><div className="text-sm">{ticket.customer}</div><div className="text-xs text-gray-500">{ticket.customerEmail}</div></td>
                      <td className="py-4 px-6"><span className="text-sm">{getCategoryLabel(ticket.category)}</span></td>
                      <td className="py-4 px-6"><span className={`inline-block px-3 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span></td>
                      <td className="py-4 px-6"><span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>{ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span></td>
                      <td className="py-4 px-6 text-sm text-gray-600">{ticket.assignedTo || <span className="text-gray-400">Unassigned</span>}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{formatDateTime(ticket.lastUpdate)}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => setSelectedTicket(ticket)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!isLoading && tickets.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No tickets found</p>
            </div>
          )}
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl mb-1">{selectedTicket.ticketNumber}</h2>
                  <p className="text-gray-600">{selectedTicket.subject}</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-gray-500 hover:text-gray-700">x</button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Customer</div>
                  <div className="text-base">{selectedTicket.customer}</div>
                  <div className="text-sm text-gray-500">{selectedTicket.customerEmail}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Status & Priority</div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-600 mb-3">Message Thread ({selectedTicket.messages} messages)</div>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <div className="text-sm mb-2"><strong>{selectedTicket.customer}:</strong> I have an issue with my order...</div>
                  <div className="text-xs text-gray-500">{formatDateTime(selectedTicket.createdAt)}</div>
                </div>
                {selectedTicket.assignedTo && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm mb-2"><strong>{selectedTicket.assignedTo}:</strong> We're looking into this issue...</div>
                    <div className="text-xs text-gray-500">{formatDateTime(selectedTicket.lastUpdate)}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => setSelectedTicket(null)} className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Close</button>
              <button className="flex-1 py-3 bg-[#e95322] text-white rounded-xl hover:bg-[#d14719] transition-colors">Reply & Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
