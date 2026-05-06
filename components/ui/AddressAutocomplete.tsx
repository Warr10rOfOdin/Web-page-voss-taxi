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
  // After the user picks a suggestion the parent updates `value`, which would
  // re-trigger the search effect and reopen the dropdown — making the user
  // think they have to click twice. Skip exactly one fetch after a select.
  const skipNextFetchRef = useRef(false);
  // Avoid clobbering newer results with an older in-flight response.
  const requestSeqRef = useRef(0);

  // Fetch suggestions from Kartverket API
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const seq = ++requestSeqRef.current;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(value)}&treffPerSide=8&sokemodus=AND`,
          { headers: { Accept: 'application/json' } }
        );

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data = await response.json();

        const formatted: AddressSuggestion[] = (data.adresser || []).map((addr: any) => {
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

        if (seq !== requestSeqRef.current) return; // stale response
        setSuggestions(formatted);
        setShowSuggestions(formatted.length > 0);
      } catch (error) {
        if (seq === requestSeqRef.current) {
          console.error('Address search error:', error);
          setSuggestions([]);
        }
      } finally {
        if (seq === requestSeqRef.current) setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 200);
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
    skipNextFetchRef.current = true;
    requestSeqRef.current++; // invalidate any in-flight request
    setSuggestions([]);
    setShowSuggestions(false);
    onChange(suggestion.street);
    onSelect?.(suggestion);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-semibold mb-3 text-white">
          {label} {required && <span className="text-taxi-yellow">*</span>}
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
            'w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl',
            'text-taxi-black placeholder-gray-400',
            'focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white',
            'smooth-transition shadow-sm',
            className
          )}
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-taxi-yellow border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              // mousedown fires before the input's blur/click-outside, so handle
              // selection there to avoid races with the dropdown closing.
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(suggestion);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handleSelect(suggestion);
              }}
              className="w-full px-5 py-4 text-left hover:bg-taxi-yellow/20 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="font-semibold text-gray-900">{suggestion.street}</div>
              <div className="text-sm text-gray-600 mt-1">
                {suggestion.postalCode} {suggestion.city}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
