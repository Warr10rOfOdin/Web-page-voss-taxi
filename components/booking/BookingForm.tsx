'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { formatDateForTaxi4U, roundToNearest5Minutes } from '@/lib/date-utils';

interface BookingFormProps {
  locale: string;
}

export function BookingForm({ locale }: BookingFormProps) {
  const t = useTranslations('booking');
  const tCta = useTranslations('cta');

  // Basic booking info
  const [clientName, setClientName] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [fromStreet, setFromStreet] = useState('');
  const [fromCity, setFromCity] = useState('Voss');
  const [fromPostalCode, setFromPostalCode] = useState('5700');
  const [fromLat, setFromLat] = useState<number | null>(null);
  const [fromLon, setFromLon] = useState<number | null>(null);
  const [toStreet, setToStreet] = useState('');
  const [toCity, setToCity] = useState('');
  const [toPostalCode, setToPostalCode] = useState('');
  const [toLat, setToLat] = useState<number | null>(null);
  const [toLon, setToLon] = useState<number | null>(null);
  const [pickupTime, setPickupTime] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [kidsCount, setKidsCount] = useState(0);
  const [kidsAges, setKidsAges] = useState<number[]>([]);
  const [kidsMonths, setKidsMonths] = useState<number[]>([]); // For 0-year-old infants
  const [messageToCar, setMessageToCar] = useState('');

  // Price quote state
  const [priceQuote, setPriceQuote] = useState<{ tariff: string; price: number } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Booking state
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookRef, setBookRef] = useState<string | null>(null);

  // Rules checking state
  const [ruleWarnings, setRuleWarnings] = useState<any[]>([]);
  const [ruleRestrictions, setRuleRestrictions] = useState<any[]>([]);
  const [ruleDisclaimers, setRuleDisclaimers] = useState<any[]>([]);
  const [hasRestrictions, setHasRestrictions] = useState(false);

  // Get current GPS location and reverse geocode to address
  const getMyLocation = async () => {
    setLoadingLocation(true);
    setError(null);

    try {
      // Get GPS coordinates
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error(locale === 'no' ? 'GPS er ikke tilgjengeleg i nettlesaren din' : 'Geolocation is not supported by your browser'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      // Store GPS coordinates
      setFromLat(latitude);
      setFromLon(longitude);

      // Reverse geocode using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': locale === 'no' ? 'no,nn,nb' : 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error(locale === 'no' ? 'Kunne ikkje hente adresse' : 'Could not fetch address');
      }

      const data = await response.json();
      const address = data.address;

      // Update location fields
      setFromStreet(address.road || address.suburb || '');
      setFromCity(address.town || address.city || address.village || 'Voss');
      setFromPostalCode(address.postcode || '5700');

    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        if (err.code === err.PERMISSION_DENIED) {
          setError(locale === 'no' ? 'Du må gi løyve til å bruke GPS-posisjonen din' : 'You must allow location access');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError(locale === 'no' ? 'Posisjon er ikkje tilgjengeleg' : 'Location unavailable');
        } else {
          setError(locale === 'no' ? 'Tidsavbrot ved henting av posisjon' : 'Location request timed out');
        }
      } else {
        setError(err instanceof Error ? err.message : (locale === 'no' ? 'Kunne ikkje hente posisjon' : 'Could not get location'));
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  // Check booking rules
  const checkRules = async (pickupTimeStr: string) => {
    if (!pickupTimeStr) {
      setRuleWarnings([]);
      setRuleRestrictions([]);
      setRuleDisclaimers([]);
      setHasRestrictions(false);
      return;
    }

    try {
      const response = await fetch(`/api/booking/check-rules?pickupTime=${encodeURIComponent(pickupTimeStr)}`);
      const data = await response.json();

      if (data.success) {
        setRuleWarnings(data.data.warnings || []);
        setRuleRestrictions(data.data.restrictions || []);
        setRuleDisclaimers(data.data.disclaimers || []);
        setHasRestrictions(data.data.hasRestrictions);
      }
    } catch (error) {
      console.error('Error checking rules:', error);
    }
  };

  // Get price quote
  const getPriceQuote = async () => {
    if (!fromStreet || !toStreet) {
      setPriceError(locale === 'no' ? 'Fyll ut henting- og leveringsadresse først' : 'Please fill in pickup and destination addresses first');
      return;
    }

    setLoadingPrice(true);
    setPriceError(null);
    setPriceQuote(null);

    try {
      // Calculate attributes based on passenger count and kids
      // Attribute codes from Taxi4U API:
      // 83=2 PERSONER, 84=3 PERSONER, 85=4 PERSONER
      // 0=6 SETER, 1=7 SETER, 89=8 SETER
      // Child seats: 12=BARNESETE (general), 8=BABY (infant seat)
      const attributes: number[] = [];

      // Add passenger count attributes
      if (passengerCount === 2) {
        attributes.push(83); // 2 PERSONER
      } else if (passengerCount === 3) {
        attributes.push(84); // 3 PERSONER
      } else if (passengerCount === 4) {
        attributes.push(85); // 4 PERSONER
      } else if (passengerCount === 5 || passengerCount === 6) {
        attributes.push(0); // 6 SETER
      } else if (passengerCount === 7) {
        attributes.push(1); // 7 SETER
      } else if (passengerCount === 8) {
        attributes.push(89); // 8 SETER
      }

      // Add child seat attributes based on kids' ages
      // Attribute codes from Taxi4U:
      // 27=SPEDBARN STOL (Infant seat)
      // 29=BARNESTOL 0-1ÅR/0-13KG
      // 30=BARNESTOL 1-4ÅR/9-18KG
      // 31=BARNESTOL 4-10ÅR/15-25KG
      kidsAges.forEach((age, index) => {
        if (age === 0) {
          // For 0 year olds, check months
          const months = kidsMonths[index] || 0;
          if (months < 12) {
            attributes.push(27); // SPEDBARN STOL (Infant seat)
          } else {
            attributes.push(29); // BARNESTOL 0-1ÅR/0-13KG
          }
        } else if (age === 1) {
          attributes.push(29); // BARNESTOL 0-1ÅR/0-13KG
        } else if (age >= 2 && age <= 4) {
          attributes.push(30); // BARNESTOL 1-4ÅR/9-18KG
        } else if (age >= 5 && age <= 10) {
          attributes.push(31); // BARNESTOL 4-10ÅR/15-25KG
        }
        // Kids 11+ typically don't need special seats
      });

      const response = await fetch('/api/pricequote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStreet,
          fromCity,
          fromPostalCode,
          fromLat: 0,
          fromLon: 0,
          toStreet,
          toCity,
          toPostalCode,
          toLat: 0,
          toLon: 0,
          attributes,
          pickupTime: pickupTime ? formatDateForTaxi4U(new Date(pickupTime)) : formatDateForTaxi4U(new Date()),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get price quote');
      }

      setPriceQuote({ tariff: data.tariff, price: data.price });
    } catch (err) {
      setPriceError(err instanceof Error ? err.message : 'Failed to get price quote');
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Auto-determine vehicle type based on passenger count
    // 1-4 passengers = Standard Taxi (carGroupId 1)
    // 5-6 passengers = Large Taxi (carGroupId 2)
    // 7+ passengers = Minibus (carGroupId 3)
    const carGroupId = passengerCount <= 4 ? 1 : passengerCount <= 6 ? 2 : 3;

    try {
      // Calculate attributes based on passenger count and kids
      // Attribute codes from Taxi4U API:
      // 83=2 PERSONER, 84=3 PERSONER, 85=4 PERSONER
      // 0=6 SETER, 1=7 SETER, 89=8 SETER
      // Child seats: 12=BARNESETE (general), 8=BABY (infant seat)
      const attributes: number[] = [];

      // Add passenger count attributes
      if (passengerCount === 2) {
        attributes.push(83); // 2 PERSONER
      } else if (passengerCount === 3) {
        attributes.push(84); // 3 PERSONER
      } else if (passengerCount === 4) {
        attributes.push(85); // 4 PERSONER
      } else if (passengerCount === 5 || passengerCount === 6) {
        attributes.push(0); // 6 SETER
      } else if (passengerCount === 7) {
        attributes.push(1); // 7 SETER
      } else if (passengerCount === 8) {
        attributes.push(89); // 8 SETER
      }

      // Add child seat attributes based on kids' ages
      // Attribute codes from Taxi4U:
      // 27=SPEDBARN STOL (Infant seat)
      // 29=BARNESTOL 0-1ÅR/0-13KG
      // 30=BARNESTOL 1-4ÅR/9-18KG
      // 31=BARNESTOL 4-10ÅR/15-25KG
      kidsAges.forEach((age, index) => {
        if (age === 0) {
          // For 0 year olds, check months
          const months = kidsMonths[index] || 0;
          if (months < 12) {
            attributes.push(27); // SPEDBARN STOL (Infant seat)
          } else {
            attributes.push(29); // BARNESTOL 0-1ÅR/0-13KG
          }
        } else if (age === 1) {
          attributes.push(29); // BARNESTOL 0-1ÅR/0-13KG
        } else if (age >= 2 && age <= 4) {
          attributes.push(30); // BARNESTOL 1-4ÅR/9-18KG
        } else if (age >= 5 && age <= 10) {
          attributes.push(31); // BARNESTOL 4-10ÅR/15-25KG
        }
        // Kids 11+ typically don't need special seats
      });

      // Prepare booking data for API
      // Calculate pickup time - round to nearest 5 minutes
      const calculatePickupTime = (): string => {
        if (pickupTime) {
          return formatDateForTaxi4U(new Date(pickupTime));
        }
        // Book now: add 5 minutes and round to nearest 5
        const now = new Date(Date.now() + 5 * 60000);
        return formatDateForTaxi4U(roundToNearest5Minutes(now));
      };

      const finalPickupTime = calculatePickupTime();

      // Build message to car including kids info
      let finalMessageToCar = messageToCar || '';
      if (kidsCount > 0 && kidsAges.length > 0) {
        const kidsAgeStrings = kidsAges.map((age, index) => {
          if (age === 0) {
            const months = kidsMonths[index] || 0;
            return locale === 'no' ? `${months} mnd` : `${months} mo`;
          }
          return locale === 'no' ? `${age} år` : `${age}y`;
        });
        const kidsInfo = locale === 'no'
          ? `${kidsCount} barn (${kidsAgeStrings.join(', ')})`
          : `${kidsCount} ${kidsCount === 1 ? 'child' : 'children'} (${kidsAgeStrings.join(', ')})`;
        finalMessageToCar = finalMessageToCar
          ? `${finalMessageToCar}. ${kidsInfo}`
          : kidsInfo;
      }

      const bookingData = {
        orderedBy: 'Website',
        messageToCar: finalMessageToCar || undefined,
        pickupTime: finalPickupTime,
        carGroupId: carGroupId,
        numberOfCars: 1,
        attributes: attributes.length > 0 ? attributes : undefined,
        passengers: [{
          seqNo: 1,
          clientName,
          tel,
          fromStreet,
          fromCity,
          fromPostalCode,
          fromLat,
          fromLon,
          toStreet: toStreet || undefined,
          toCity: toCity || undefined,
          toPostalCode: toPostalCode || undefined,
          toLat: toLat || undefined,
          toLon: toLon || undefined,
          pickupTime: finalPickupTime,
        }],
      };

      // Log booking data for debugging
      console.log('Sending booking data:', JSON.stringify(bookingData, null, 2));

      const response = await fetch('/api/booking/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Log full error details for debugging
        console.error('Booking failed:', {
          status: response.status,
          error: data.error,
          details: data.details,
          fullResponse: data
        });
        throw new Error(data.error || data.details || 'Booking failed');
      }

      setSuccess(true);
      setBookRef(data.bookRef);

      // Send email confirmation (non-blocking) if email was provided
      if (email) {
        try {
          const pickupTimeFormatted = pickupTime
            ? new Date(pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })
            : (locale === 'no' ? 'Snarast mogleg' : 'As soon as possible');

          await fetch('/api/email/booking-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emailTo: email,
              bookRef: data.bookRef,
              customerName: clientName,
              pickupTime: pickupTimeFormatted,
              from: `${fromStreet}, ${fromCity}`,
              destination: toStreet ? `${toStreet}, ${toCity}` : undefined,
              passengerCount,
              locale,
            }),
          });
        } catch (emailError) {
          console.error('Email send failed:', emailError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setTel('');
    setEmail('');
    setFromStreet('');
    setFromCity('Voss');
    setFromPostalCode('5700');
    setToStreet('');
    setToCity('');
    setToPostalCode('');
    setPickupTime('');
    setPassengerCount(1);
    setKidsCount(0);
    setKidsAges([]);
    setKidsMonths([]);
    setMessageToCar('');
    setPriceQuote(null);
    setPriceError(null);
    setSuccess(false);
    setBookRef(null);
  };

  // Get minimum datetime (now + 5 minutes, rounded to nearest 5)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Add 5 minutes buffer
    const rounded = roundToNearest5Minutes(now);
    return rounded.toISOString().slice(0, 16);
  };

  if (success && bookRef) {
    return (
      <div className="glass-dark backdrop-blur-xl rounded-3xl overflow-hidden depth-4">
        <div className="p-8 md:p-12 text-center space-y-6">
          {/* Success Icon with Glow */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full glass-yellow depth-glow-strong mb-4">
            <svg className="w-12 h-12 text-taxi-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            {t('successTitle')}
          </h2>

          <p className="text-lg text-taxi-light-grey/90">{t('successMessage')}</p>

          {/* Booking Reference Card */}
          <div className="glass-strong backdrop-blur-xl rounded-2xl p-6 depth-2 border-2 border-taxi-yellow/30">
            <p className="text-sm text-taxi-light-grey/70 mb-2">{t('bookingReference')}</p>
            <p className="text-3xl md:text-4xl font-bold text-taxi-yellow tracking-wider font-mono">
              {bookRef}
            </p>
            <p className="text-xs text-taxi-light-grey/60 mt-3">
              {locale === 'no' ? 'Ta vare på denne referansen' : 'Save this reference number'}
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="glass-strong backdrop-blur-xl rounded-2xl p-6 depth-2 border border-white/10 text-left">
            <h3 className="text-lg font-bold text-white mb-4">
              {locale === 'no' ? 'Bookingdetaljer' : 'Booking Details'}
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-taxi-light-grey/60 mb-1">
                  {locale === 'no' ? 'Henting' : 'Pickup'}
                </p>
                <p className="text-white font-semibold">
                  {fromStreet}, {fromCity} {fromPostalCode}
                </p>
              </div>
              {toStreet && (
                <div>
                  <p className="text-taxi-light-grey/60 mb-1">
                    {locale === 'no' ? 'Destinasjon' : 'Destination'}
                  </p>
                  <p className="text-white font-semibold">
                    {toStreet}, {toCity} {toPostalCode}
                  </p>
                </div>
              )}
              <div>
                <p className="text-taxi-light-grey/60 mb-1">
                  {locale === 'no' ? 'Hentetid' : 'Pickup Time'}
                </p>
                <p className="text-white font-semibold">
                  {pickupTime
                    ? new Date(pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })
                    : (locale === 'no' ? 'Snarast mogleg' : 'As soon as possible')
                  }
                </p>
              </div>
              <div>
                <p className="text-taxi-light-grey/60 mb-1">
                  {locale === 'no' ? 'Passasjerer' : 'Passengers'}
                </p>
                <p className="text-white font-semibold">
                  {passengerCount} {passengerCount === 1 ? (locale === 'no' ? 'passasjer' : 'passenger') : (locale === 'no' ? 'passasjerer' : 'passengers')}
                  {kidsCount > 0 && (
                    <span className="text-taxi-yellow ml-2">
                      ({kidsCount} {kidsCount === 1 ? (locale === 'no' ? 'barn' : 'child') : (locale === 'no' ? 'born' : 'children')})
                    </span>
                  )}
                </p>
                {kidsCount > 0 && kidsAges.length > 0 && (
                  <p className="text-white/70 text-sm mt-1">
                    {locale === 'no' ? 'Alder:' : 'Ages:'} {kidsAges.map((age, i) => {
                      if (age === 0) {
                        const months = kidsMonths[i] || 0;
                        return (
                          <span key={i}>
                            {months} {months === 1 ? (locale === 'no' ? 'månad' : 'month') : (locale === 'no' ? 'månader' : 'months')}
                            {i < kidsAges.length - 1 ? ', ' : ''}
                          </span>
                        );
                      }
                      return (
                        <span key={i}>
                          {age} {age === 1 ? (locale === 'no' ? 'år' : 'year') : (locale === 'no' ? 'år' : 'years')}
                          {i < kidsAges.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="text-taxi-light-grey/90">{t('confirmationNote')}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={`/${locale}/manage-booking`}
              className="flex-1 glass-yellow rounded-full px-8 py-4 font-bold text-taxi-black hover-scale smooth-transition depth-2 inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {locale === 'no' ? 'Sjekk/endre booking' : 'View/Manage Booking'}
            </a>
            <button
              onClick={resetForm}
              className="flex-1 glass-strong backdrop-blur-xl rounded-full px-8 py-4 font-bold text-white hover:text-taxi-yellow hover-lift smooth-transition depth-2"
            >
              {t('bookAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden depth-4 border-2 border-white/10 shadow-2xl">
      <div className="p-6 sm:p-8 md:p-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
          {t('title')}
        </h2>
        <div className="h-1.5 w-24 sm:w-32 bg-gradient-to-r from-taxi-yellow via-taxi-yellow to-transparent mb-8 sm:mb-10 rounded-full shadow-lg" />

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-white">
                {t('name')} *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-white">
                {t('phone')} *
              </label>
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
                className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
                placeholder="+47 123 45 678"
              />
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-white">
              {t('email')}
              <span className="ml-2 text-xs text-white/70 font-normal bg-white/20 px-2 py-1 rounded-full">
                {locale === 'no' ? 'valfritt' : 'optional'}
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
              placeholder="din@epost.no"
            />
            <p className="text-xs text-white/70 mt-2">
              {t('emailNote')}
            </p>
          </div>

          {/* Passenger Count */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-white">
              {locale === 'no' ? 'Totalt antall passasjerer *' : 'Total Number of Passengers *'}
            </label>
            <select
              value={passengerCount}
              onChange={(e) => {
                const newCount = Number(e.target.value);
                setPassengerCount(newCount);
                // Reset kids count if it exceeds new passenger count
                if (kidsCount > newCount - 1) {
                  setKidsCount(0);
                  setKidsAges([]);
                }
              }}
              required
              className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm cursor-pointer"
            >
              <option value={1}>1 {locale === 'no' ? 'passasjer' : 'passenger'}</option>
              <option value={2}>2 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={3}>3 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={4}>4 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={5}>5 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={6}>6 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={7}>7 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={8}>8 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
            </select>
            <p className="text-xs text-white/70 mt-2">
              {locale === 'no'
                ? '👥 Dette er totalt antall personar, inkludert born'
                : '👥 This is the total number of people, including children'}
            </p>
          </div>

          {/* Kids Count */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-white">
              {locale === 'no' ? 'Kor mange av desse er born?' : 'How many of these are children?'}
            </label>
            <select
              value={kidsCount}
              onChange={(e) => {
                const count = Number(e.target.value);
                setKidsCount(count);
                // Initialize ages and months arrays
                if (count > kidsAges.length) {
                  setKidsAges([...kidsAges, ...Array(count - kidsAges.length).fill(5)]);
                  setKidsMonths([...kidsMonths, ...Array(count - kidsMonths.length).fill(0)]);
                } else {
                  setKidsAges(kidsAges.slice(0, count));
                  setKidsMonths(kidsMonths.slice(0, count));
                }
              }}
              className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm cursor-pointer"
            >
              <option value={0}>{locale === 'no' ? 'Ingen born' : 'No children'}</option>
              {Array.from({ length: Math.min(passengerCount, 7) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? (locale === 'no' ? 'barn' : 'child') : (locale === 'no' ? 'born' : 'children')}
                </option>
              ))}
            </select>
            {kidsCount > 0 && (
              <p className="text-xs text-white/70 mt-2">
                {locale === 'no'
                  ? '⚠️ Born er inkludert i totalt antall passasjerer, ikkje i tillegg'
                  : '⚠️ Children are included in the total passenger count, not additional'}
              </p>
            )}
          </div>

          {/* Kids Ages */}
          {kidsCount > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-taxi-yellow/30 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <svg className="w-5 h-5 text-taxi-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {locale === 'no' ? 'Alder på born' : 'Ages of Children'}
              </h3>
              <p className="text-sm text-white/80">
                {locale === 'no'
                  ? 'Oppgi alderen for kvart barn slik at vi kan sørge for riktige barnesete.'
                  : 'Specify the age of each child so we can provide appropriate child seats.'}
              </p>
              <div className="space-y-4">
                {kidsAges.map((age, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/20">
                    <label className="block text-sm font-semibold mb-2 text-white">
                      {locale === 'no' ? `Barn ${index + 1}` : `Child ${index + 1}`}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/70 mb-1">
                          {locale === 'no' ? 'Alder (år)' : 'Age (years)'}
                        </label>
                        <select
                          value={age}
                          onChange={(e) => {
                            const newAges = [...kidsAges];
                            newAges[index] = Number(e.target.value);
                            setKidsAges(newAges);
                          }}
                          className="w-full px-4 py-3 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm cursor-pointer"
                        >
                          <option value={0}>{locale === 'no' ? '0 år' : '0 years'}</option>
                          {Array.from({ length: 17 }, (_, i) => i + 1).map(a => (
                            <option key={a} value={a}>
                              {a} {a === 1 ? (locale === 'no' ? 'år' : 'year') : (locale === 'no' ? 'år' : 'years')}
                            </option>
                          ))}
                        </select>
                      </div>
                      {age === 0 && (
                        <div>
                          <label className="block text-xs text-white/70 mb-1">
                            {locale === 'no' ? 'Månader' : 'Months'}
                          </label>
                          <select
                            value={kidsMonths[index] || 0}
                            onChange={(e) => {
                              const newMonths = [...kidsMonths];
                              newMonths[index] = Number(e.target.value);
                              setKidsMonths(newMonths);
                            }}
                            className="w-full px-4 py-3 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm cursor-pointer"
                          >
                            {Array.from({ length: 12 }, (_, i) => i).map(m => (
                              <option key={m} value={m}>
                                {m} {m === 1 ? (locale === 'no' ? 'månad' : 'month') : (locale === 'no' ? 'månader' : 'months')}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-taxi-yellow/10 border border-taxi-yellow/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-white/90">
                  <span className="font-bold text-taxi-yellow">ℹ️ {locale === 'no' ? 'Barnesete-info:' : 'Child Seat Info:'}</span>
                  <br />
                  {locale === 'no' ? (
                    <>
                      • 0-11 mnd: Spedbarnstol (0-13kg)<br />
                      • 0-1 år: Barnestol 0-1år (0-13kg)<br />
                      • 1-4 år: Barnestol 1-4år (9-18kg)<br />
                      • 5-10 år: Barnestol 4-10år (15-25kg)<br />
                      • 11+ år: Vanleg beltesete
                    </>
                  ) : (
                    <>
                      • 0-11 mo: Infant seat (0-13kg)<br />
                      • 0-1 year: Child seat 0-1yr (0-13kg)<br />
                      • 1-4 years: Child seat 1-4yr (9-18kg)<br />
                      • 5-10 years: Child seat 4-10yr (15-25kg)<br />
                      • 11+ years: Regular seat belt
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Pickup Location */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-taxi-yellow/30 space-y-5 mt-8">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-taxi-yellow flex items-center flex-shrink-0">
                <svg className="w-6 h-6 text-taxi-yellow mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
                <span className="hidden sm:inline">{t('pickupLocation')}</span>
                <span className="sm:hidden">{locale === 'no' ? 'Henting' : 'Pickup'}</span>
              </h3>
              <button
                type="button"
                onClick={getMyLocation}
                disabled={loadingLocation}
                className="text-xs sm:text-sm font-bold text-taxi-black hover:text-taxi-black/80 transition-colors flex items-center gap-2 disabled:opacity-50 bg-taxi-yellow px-4 py-3 rounded-full hover-scale smooth-transition whitespace-nowrap shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {loadingLocation
                  ? (locale === 'no' ? 'Hentar...' : 'Getting...')
                  : (locale === 'no' ? 'Bruk min posisjon' : 'Use my location')
                }
              </button>
            </div>

            <AddressAutocomplete
              value={fromStreet}
              onChange={setFromStreet}
              onSelect={(address) => {
                setFromStreet(address.street);
                setFromCity(address.city);
                setFromPostalCode(address.postalCode);
                // Store GPS coordinates if available
                if (address.lat && address.lon) {
                  setFromLat(address.lat);
                  setFromLon(address.lon);
                }
              }}
              label={t('street')}
              placeholder="Uttrågata 19"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  {t('city')} *
                </label>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  required
                  className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  {t('postalCode')} *
                </label>
                <input
                  type="text"
                  value={fromPostalCode}
                  onChange={(e) => setFromPostalCode(e.target.value)}
                  required
                  className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-white/20 space-y-5 mt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-taxi-yellow flex items-center mb-2">
              <svg className="w-6 h-6 text-taxi-yellow mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('destination')}
              <span className="ml-3 text-sm text-white/70 font-normal bg-white/20 px-3 py-1 rounded-full">
                {locale === 'no' ? 'valfritt' : 'optional'}
              </span>
            </h3>

            <AddressAutocomplete
              value={toStreet}
              onChange={setToStreet}
              onSelect={(address) => {
                setToStreet(address.street);
                setToCity(address.city);
                setToPostalCode(address.postalCode);
                // Store GPS coordinates if available
                if (address.lat && address.lon) {
                  setToLat(address.lat);
                  setToLon(address.lon);
                }
              }}
              label={t('street')}
              placeholder={t('optionalDestination')}
              required={false}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  {t('city')}
                </label>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  {t('postalCode')}
                </label>
                <input
                  type="text"
                  value={toPostalCode}
                  onChange={(e) => setToPostalCode(e.target.value)}
                  className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Price Quote Button - Only for 1-4 passengers */}
          {passengerCount >= 1 && passengerCount <= 4 && (
            <div>
              <Button
                type="button"
                onClick={getPriceQuote}
                disabled={loadingPrice || !fromStreet || !toStreet}
                variant="secondary"
                className="w-full"
                title={!toStreet ? (locale === 'no' ? 'Treng destinasjon for prisestimat' : 'Destination required for price quote') : ''}
              >
                {loadingPrice
                  ? (locale === 'no' ? 'Hentar prisestimat...' : 'Getting price quote...')
                  : (locale === 'no' ? 'Få prisestimat' : 'Get price quote')
                }
              </Button>

              {/* Price Quote Display */}
              {priceQuote && (
                <div className="mt-4 glass-yellow backdrop-blur-xl rounded-2xl p-6 depth-2 border-2 border-taxi-yellow/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-taxi-black/70 font-semibold">
                        {locale === 'no' ? 'Estimert pris' : 'Estimated price'}
                      </p>
                      <p className="text-3xl md:text-4xl font-bold text-taxi-black mt-1">
                        {priceQuote.price} kr
                      </p>
                      {priceQuote.tariff && (
                        <p className="text-xs text-taxi-black/60 mt-2">
                          {locale === 'no' ? 'Takst' : 'Tariff'}: {priceQuote.tariff}
                        </p>
                      )}
                    </div>
                    <div className="glass-strong rounded-full p-4 depth-2">
                      <svg className="w-10 h-10 text-taxi-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="h-px bg-taxi-black/20 my-3" />
                  <p className="text-xs text-taxi-black/70">
                    {locale === 'no'
                      ? 'Dette er eit estimat. Faktisk pris kan variere avhengig av trafikk og rute.'
                      : 'This is an estimate. Actual price may vary depending on traffic and route.'
                    }
                  </p>
                </div>
              )}

              {/* Price Error */}
              {priceError && (
                <div className="mt-4 glass-dark backdrop-blur-xl px-4 py-3 rounded-xl border border-red-500/50">
                  <p className="text-sm text-red-300">{priceError}</p>
                </div>
              )}
            </div>
          )}

          {/* Pickup Time */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-3 text-white">
              {t('pickupTime')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Date Picker */}
              <input
                type="date"
                value={pickupTime ? pickupTime.split('T')[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    const currentTime = pickupTime ? pickupTime.split('T')[1] || '12:00' : '12:00';
                    const newDateTime = `${e.target.value}T${currentTime}`;
                    const selectedDate = new Date(newDateTime);
                    const rounded = roundToNearest5Minutes(selectedDate);
                    const timeStr = rounded.toISOString().slice(0, 16);
                    setPickupTime(timeStr);
                    checkRules(formatDateForTaxi4U(rounded));
                  } else {
                    setPickupTime('');
                    checkRules('');
                  }
                }}
                min={getMinDateTime().split('T')[0]}
                className="col-span-3 sm:col-span-1 px-4 py-3 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
              />

              {/* Hour Picker */}
              <select
                value={pickupTime ? pickupTime.split('T')[1]?.split(':')[0] || '' : ''}
                onChange={(e) => {
                  const currentDate = pickupTime ? pickupTime.split('T')[0] : new Date().toISOString().split('T')[0];
                  const currentMinute = pickupTime ? pickupTime.split('T')[1]?.split(':')[1] || '00' : '00';
                  const newDateTime = `${currentDate}T${e.target.value}:${currentMinute}`;
                  const selectedDate = new Date(newDateTime);
                  const rounded = roundToNearest5Minutes(selectedDate);
                  const timeStr = rounded.toISOString().slice(0, 16);
                  setPickupTime(timeStr);
                  checkRules(formatDateForTaxi4U(rounded));
                }}
                className="col-span-3 sm:col-span-1 px-4 py-3 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
              >
                <option value="">HH</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i.toString().padStart(2, '0')}>
                    {i.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>

              {/* Minute Picker - 5 minute increments only */}
              <select
                value={pickupTime ? pickupTime.split('T')[1]?.split(':')[1] || '' : ''}
                onChange={(e) => {
                  const currentDate = pickupTime ? pickupTime.split('T')[0] : new Date().toISOString().split('T')[0];
                  const currentHour = pickupTime ? pickupTime.split('T')[1]?.split(':')[0] || '12' : '12';
                  const newDateTime = `${currentDate}T${currentHour}:${e.target.value}`;
                  const selectedDate = new Date(newDateTime);
                  const timeStr = selectedDate.toISOString().slice(0, 16);
                  setPickupTime(timeStr);
                  checkRules(formatDateForTaxi4U(selectedDate));
                }}
                className="col-span-3 sm:col-span-1 px-4 py-3 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
              >
                <option value="">MM</option>
                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((min) => (
                  <option key={min} value={min}>
                    {min}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-white/70 mt-3 bg-white/10 px-4 py-2 rounded-lg">{t('pickupTimeNote')}</p>

            {/* Rule Restrictions */}
            {hasRestrictions && ruleRestrictions.length > 0 && (
              <div className="mt-4 bg-red-900/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl">
                <p className="font-bold text-white mb-2">
                  {locale === 'no' ? '⚠️ Bestilling ikke mulig' : '⚠️ Booking not possible'}
                </p>
                {ruleRestrictions.map((rule, index) => (
                  <p key={index} className="text-sm mb-1">
                    {locale === 'no' ? rule.messageNo : rule.messageEn}
                  </p>
                ))}
              </div>
            )}

            {/* Rule Warnings */}
            {ruleWarnings.length > 0 && (
              <div className="mt-4 bg-yellow-900/20 border border-yellow-500/50 text-yellow-300 px-6 py-4 rounded-xl">
                <p className="font-bold text-white mb-2">
                  {locale === 'no' ? '⚠️ Viktig informasjon' : '⚠️ Important information'}
                </p>
                {ruleWarnings.map((rule, index) => (
                  <p key={index} className="text-sm mb-1">
                    {locale === 'no' ? rule.messageNo : rule.messageEn}
                  </p>
                ))}
              </div>
            )}

            {/* Rule Disclaimers */}
            {ruleDisclaimers.length > 0 && (
              <div className="mt-4 bg-blue-900/20 border border-blue-500/50 text-blue-300 px-6 py-4 rounded-xl">
                <p className="font-bold text-white mb-2">
                  {locale === 'no' ? 'ℹ️ Merk' : 'ℹ️ Note'}
                </p>
                {ruleDisclaimers.map((rule, index) => (
                  <p key={index} className="text-sm mb-1">
                    {locale === 'no' ? rule.messageNo : rule.messageEn}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* General Message to Driver */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-3 text-white">
              {t('messageOptional')}
            </label>
            <textarea
              value={messageToCar}
              onChange={(e) => setMessageToCar(e.target.value)}
              rows={3}
              className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition resize-none shadow-sm"
              placeholder={t('messagePlaceholder')}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="glass-dark backdrop-blur-xl border border-red-500/50 text-red-300 px-6 py-4 rounded-2xl depth-2">
              <p className="font-bold text-white mb-1">{t('errorTitle')}</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full depth-glow hover-scale smooth-transition text-lg font-bold py-6"
            disabled={loading || hasRestrictions}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('processing')}
              </span>
            ) : (
              tCta('bookNow')
            )}
          </Button>

          <p className="text-xs text-center text-taxi-light-grey/70">
            {t('privacyNote')}
          </p>
        </form>
      </div>
    </div>
  );
}
