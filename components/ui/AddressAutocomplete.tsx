'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  postalCode: string;
  lat?: number;
  lon?: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: AddressSuggestion) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  label,
  required = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from Kartverket API
  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        // Using Kartverket's address search API (free, no API key needed)
        const response = await fetch(
          `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(value)}&treffPerSide=10&sokemodus=AND`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data = await response.json();

        const formatted: AddressSuggestion[] = (data.adresser || []).map((addr: any) => {
          // Extract GPS coordinates from representasjonspunkt
          let lat: number | undefined;
          let lon: number | undefined;

          if (addr.representasjonspunkt?.lat && addr.representasjonspunkt?.lon) {
            lat = parseFloat(addr.representasjonspunkt.lat);
            lon = parseFloat(addr.representasjonspunkt.lon);
          }

          return {
            display: `${addr.adressetekst}, ${addr.postnummer} ${addr.poststed}`,
            street: addr.adressetekst || '',
            city: addr.poststed || '',
            postalCode: addr.postnummer || '',
            lat,
            lon,
          };
        });

        setSuggestions(formatted);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Address search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.street);
    setShowSuggestions(false);
    onSelect?.(suggestion);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          required={required}
          className={cn(
            'w-full px-4 py-2 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-taxi-yellow focus:border-transparent',
            'transition-all duration-200',
            className
          )}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-taxi-yellow border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-taxi-yellow/10 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{suggestion.street}</div>
              <div className="text-sm text-gray-600">
                {suggestion.postalCode} {suggestion.city}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
