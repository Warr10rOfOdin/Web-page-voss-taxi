'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function AttributesDebugPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin-auth');
    if (auth === 'true') {
      setAuthenticated(true);
      fetchAttributes();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Hestavangen11') {
      sessionStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
      fetchAttributes();
    } else {
      alert('Invalid password');
    }
  };

  const fetchAttributes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/booking/attributes');
      const data = await response.json();

      if (data.success) {
        setAttributes(data.attributes || []);
      } else {
        setError(data.error || 'Failed to fetch attributes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
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

  // Filter passenger-related attributes
  const passengerAttributes = attributes.filter(
    (attr) =>
      attr.name &&
      (attr.name.includes('PERSON') ||
        attr.name.includes('SETER') ||
        attr.name.includes('SEAT') ||
        attr.name.includes('PASSENGER'))
  );

  const otherAttributes = attributes.filter(
    (attr) =>
      !attr.name ||
      (!attr.name.includes('PERSON') &&
        !attr.name.includes('SETER') &&
        !attr.name.includes('SEAT') &&
        !attr.name.includes('PASSENGER'))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black py-16">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Taxi4U Attributes Debug</h1>
            <Button onClick={fetchAttributes} variant="primary" disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-6 py-4 rounded-xl mb-6">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {loading && <p className="text-white">Loading attributes...</p>}

          {!loading && attributes.length === 0 && !error && (
            <p className="text-white/70">No attributes found</p>
          )}

          {!loading && passengerAttributes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                🚗 Passenger-Related Attributes ({passengerAttributes.length})
              </h2>
              <div className="space-y-3">
                {passengerAttributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="bg-taxi-yellow/10 border border-taxi-yellow/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xl font-bold text-white">
                          ID: {attr.id} - {attr.name}
                        </p>
                        {attr.description && (
                          <p className="text-white/70 text-sm mt-1">{attr.description}</p>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-taxi-yellow text-taxi-black rounded-full text-xs font-bold">
                        IMPORTANT
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-white/60">
                      <pre className="bg-black/30 p-2 rounded overflow-x-auto">
                        {JSON.stringify(attr, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && otherAttributes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                📋 Other Attributes ({otherAttributes.length})
              </h2>
              <div className="space-y-3">
                {otherAttributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="bg-white/10 border border-white/20 rounded-lg p-4"
                  >
                    <p className="text-lg font-bold text-white">
                      ID: {attr.id} - {attr.name || 'Unnamed'}
                    </p>
                    {attr.description && (
                      <p className="text-white/70 text-sm mt-1">{attr.description}</p>
                    )}
                    <details className="mt-2">
                      <summary className="text-sm text-taxi-yellow cursor-pointer hover:underline">
                        Show JSON
                      </summary>
                      <pre className="bg-black/30 p-2 rounded overflow-x-auto text-xs text-white/80 mt-2">
                        {JSON.stringify(attr, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && attributes.length > 0 && (
            <div className="mt-8 bg-blue-900/20 border border-blue-500/50 text-blue-300 px-6 py-4 rounded-xl">
              <p className="font-bold text-white mb-2">💡 Usage Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Look for passenger count attributes above (e.g., &quot;2 PERSONER&quot;, &quot;6 SETER&quot;)</li>
                <li>Note the ID numbers for each passenger count</li>
                <li>Update the booking form to use these IDs in the attributes array</li>
                <li>Test bookings to ensure dispatchers can see vehicle requirements</li>
              </ol>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-3">📖 Current Mapping (from code):</h3>
            <div className="bg-white/10 rounded-lg p-4 text-white/90 text-sm space-y-1">
              <p>• 1 passenger → carGroupId: 1 (Standard), no attributes</p>
              <p>• 2 passengers → carGroupId: 1 (Standard), attributes: [2]</p>
              <p>• 3 passengers → carGroupId: 1 (Standard), attributes: [3]</p>
              <p>• 4 passengers → carGroupId: 1 (Standard), attributes: [4]</p>
              <p>• 5 passengers → carGroupId: 2 (Large), no attributes, message: &quot;5 passasjerar&quot;</p>
              <p>• 6 passengers → carGroupId: 2 (Large), no attributes, message: &quot;6 passasjerar&quot;</p>
              <p>• 7 passengers → carGroupId: 3 (Minibus), no attributes, message: &quot;7 passasjerar&quot;</p>
              <p>• 8 passengers → carGroupId: 3 (Minibus), no attributes, message: &quot;8 passasjerar&quot;</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
