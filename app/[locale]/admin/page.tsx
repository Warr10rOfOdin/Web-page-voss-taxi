'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookingRule, RuleType, DayOfWeek, TimeRange } from '@/types/booking-rules';

interface BookingStats {
  totalBookings: number;
  successfulBookings: number;
  failedBookings: number;
  bookingsByType: {
    simple: number;
    general: number;
  };
  recentBookings: Array<{
    id: string;
    timestamp: string;
    bookRef?: string;
    customerName: string;
    fromCity: string;
    toCity?: string;
    pickupTime: string;
    bookingType: string;
    success: boolean;
  }>;
  bookingsByDay: Record<string, number>;
  bookingsByMonth: Record<string, number>;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rules, setRules] = useState<BookingRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<BookingRule | null>(null);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [showStats, setShowStats] = useState(true);

  // Form state
  const [formData, setFormData] = useState<Partial<BookingRule>>({
    type: 'warning',
    name: '',
    description: '',
    active: true,
    timeRanges: [],
    daysOfWeek: [],
    messageNo: '',
    messageEn: '',
    blockBooking: false,
  });

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('admin-auth');
    if (auth === 'true') {
      setAuthenticated(true);
      fetchRules();
      fetchStats();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'Hestavangen11') {
      sessionStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
      fetchRules();
      fetchStats();
    } else {
      alert('Invalid password');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats?type=summary');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/rules');
      const data = await response.json();
      if (data.success) {
        setRules(data.data.rules);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingRule ? '/api/admin/rules' : '/api/admin/rules';
      const method = editingRule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRule ? { ...formData, id: editingRule.id } : formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchRules();
        setShowForm(false);
        setEditingRule(null);
        resetForm();
      } else {
        alert('Error saving rule: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Error saving rule');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/rules?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchRules();
      } else {
        alert('Error deleting rule: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Error deleting rule');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRule = (rule: BookingRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'warning',
      name: '',
      description: '',
      active: true,
      timeRanges: [],
      daysOfWeek: [],
      messageNo: '',
      messageEn: '',
      blockBooking: false,
    });
  };

  const addTimeRange = () => {
    setFormData({
      ...formData,
      timeRanges: [...(formData.timeRanges || []), { start: '07:00', end: '08:30' }],
    });
  };

  const removeTimeRange = (index: number) => {
    const newRanges = [...(formData.timeRanges || [])];
    newRanges.splice(index, 1);
    setFormData({ ...formData, timeRanges: newRanges });
  };

  const updateTimeRange = (index: number, field: 'start' | 'end', value: string) => {
    const newRanges = [...(formData.timeRanges || [])];
    newRanges[index][field] = value;
    setFormData({ ...formData, timeRanges: newRanges });
  };

  const toggleDay = (day: DayOfWeek) => {
    const days = formData.daysOfWeek || [];
    const newDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];
    setFormData({ ...formData, daysOfWeek: newDays });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-4"
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black py-16">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowStats(!showStats)}
                variant="secondary"
              >
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    setEditingRule(null);
                    resetForm();
                  }
                }}
                variant="primary"
              >
                {showForm ? 'Cancel' : 'Add New Rule'}
              </Button>
            </div>
          </div>

          {/* Booking Statistics Section */}
          {showStats && stats && (
            <div className="mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Booking Statistics</h2>
                <button
                  onClick={fetchStats}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Refresh
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-taxi-yellow/20 to-taxi-yellow/10 backdrop-blur-md border border-taxi-yellow/30 rounded-xl p-6">
                  <h3 className="text-taxi-yellow/80 text-sm font-semibold mb-2">Total Bookings</h3>
                  <p className="text-4xl font-bold text-white">{stats.totalBookings}</p>
                </div>

                <div className="bg-gradient-to-br from-green-600/20 to-green-600/10 backdrop-blur-md border border-green-600/30 rounded-xl p-6">
                  <h3 className="text-green-400 text-sm font-semibold mb-2">Successful</h3>
                  <p className="text-4xl font-bold text-white">{stats.successfulBookings}</p>
                  <p className="text-green-400 text-xs mt-1">
                    {stats.totalBookings > 0 ? Math.round((stats.successfulBookings / stats.totalBookings) * 100) : 0}% success rate
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-600/20 to-red-600/10 backdrop-blur-md border border-red-600/30 rounded-xl p-6">
                  <h3 className="text-red-400 text-sm font-semibold mb-2">Failed</h3>
                  <p className="text-4xl font-bold text-white">{stats.failedBookings}</p>
                  <p className="text-red-400 text-xs mt-1">
                    {stats.totalBookings > 0 ? Math.round((stats.failedBookings / stats.totalBookings) * 100) : 0}% failure rate
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 backdrop-blur-md border border-blue-600/30 rounded-xl p-6">
                  <h3 className="text-blue-400 text-sm font-semibold mb-2">By Type</h3>
                  <p className="text-white text-sm">Simple: {stats.bookingsByType.simple}</p>
                  <p className="text-white text-sm">General: {stats.bookingsByType.general}</p>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
                {stats.recentBookings.length === 0 ? (
                  <p className="text-white/70">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white/5 rounded-lg p-4 flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-white">{booking.customerName}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                booking.success
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}
                            >
                              {booking.success ? 'Success' : 'Failed'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-600 text-white">
                              {booking.bookingType}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm">
                            {booking.fromCity} → {booking.toCity || 'Not specified'}
                          </p>
                          <p className="text-white/50 text-xs">
                            Pickup: {new Date(booking.pickupTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {booking.bookRef && (
                            <p className="text-taxi-yellow text-sm font-mono">#{booking.bookRef}</p>
                          )}
                          <p className="text-white/50 text-xs">
                            {new Date(booking.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Monthly Statistics */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Bookings by Month</h3>
                {Object.keys(stats.bookingsByMonth).length === 0 ? (
                  <p className="text-white/70">No data yet</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(stats.bookingsByMonth)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .slice(0, 6)
                      .map(([month, count]) => (
                        <div key={month} className="flex justify-between items-center">
                          <span className="text-white">{month}</span>
                          <span className="font-semibold text-taxi-yellow">{count} bookings</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking Rules Section */}
          <div className="border-t border-white/20 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Rules Management</h2>

          {showForm && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingRule ? 'Edit Rule' : 'New Rule'}
              </h2>
              <form onSubmit={handleSaveRule} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Rule Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Type *</label>
                    <select
                      value={formData.type || 'warning'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as RuleType })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                      required
                    >
                      <option value="warning">Warning</option>
                      <option value="disclaimer">Disclaimer</option>
                      <option value="restriction">Restriction</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                    rows={2}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Message (Norwegian) *</label>
                    <textarea
                      value={formData.messageNo || ''}
                      onChange={(e) => setFormData({ ...formData, messageNo: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Message (English) *</label>
                    <textarea
                      value={formData.messageEn || ''}
                      onChange={(e) => setFormData({ ...formData, messageEn: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Days of Week</label>
                  <div className="flex flex-wrap gap-2">
                    {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as DayOfWeek[]).map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          (formData.daysOfWeek || []).includes(day)
                            ? 'bg-taxi-yellow text-taxi-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Time Ranges</label>
                  {(formData.timeRanges || []).map((range, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => updateTimeRange(index, 'start', e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                      <span className="text-white self-center">to</span>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => updateTimeRange(index, 'end', e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeTimeRange(index)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeRange}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                  >
                    + Add Time Range
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.blockBooking || false}
                      onChange={(e) => setFormData({ ...formData, blockBooking: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span>Block Booking (prevents booking during this time)</span>
                  </label>

                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.active ?? true}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Rule'}
                  </Button>
                  {editingRule && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowForm(false);
                        setEditingRule(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {loading && rules.length === 0 ? (
              <p className="text-white">Loading...</p>
            ) : rules.length === 0 ? (
              <p className="text-white/70">No rules configured yet.</p>
            ) : (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{rule.name}</h3>
                      <p className="text-white/70 text-sm">{rule.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rule.active
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-taxi-yellow text-taxi-black">
                        {rule.type}
                      </span>
                      {rule.blockBooking && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                          Blocks Booking
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    {rule.daysOfWeek && rule.daysOfWeek.length > 0 && (
                      <div>
                        <span className="text-white/70">Days:</span>
                        <span className="text-white ml-2">
                          {rule.daysOfWeek.map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(', ')}
                        </span>
                      </div>
                    )}

                    {rule.timeRanges && rule.timeRanges.length > 0 && (
                      <div>
                        <span className="text-white/70">Times:</span>
                        <span className="text-white ml-2">
                          {rule.timeRanges.map((r) => `${r.start}-${r.end}`).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <p className="text-white text-sm mb-2">
                      <strong>NO:</strong> {rule.messageNo}
                    </p>
                    <p className="text-white text-sm">
                      <strong>EN:</strong> {rule.messageEn}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="px-4 py-2 bg-taxi-yellow text-taxi-black rounded-lg hover:bg-taxi-yellow/90 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
