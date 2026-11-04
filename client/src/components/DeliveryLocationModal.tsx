import React, { useState } from 'react';
import { MapPin, X, Navigation, Check, ChevronRight, Loader2 } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const TAMIL_TO_ENGLISH_MAP: Record<string, string> = {
  'திருத்தணி': 'Tiruttani',
  'சென்னை': 'Chennai',
  'தமிழ்நாடு': 'Tamil Nadu',
  'தமிழ் நாடு': 'Tamil Nadu',
  'திருவள்ளூர்': 'Tiruvallur',
  'காஞ்சிபுரம்': 'Kanchipuram',
  'செங்கல்பட்டு': 'Chengalpattu',
  'கோயம்புத்தூர்': 'Coimbatore',
  'கோவை': 'Coimbatore',
  'மதுரை': 'Madurai',
  'திருச்சிராப்பள்ளி': 'Tiruchirappalli',
  'திருச்சி': 'Tiruchirappalli',
  'சேலம்': 'Salem',
  'வேலூர்': 'Vellore',
  'ஈரோடு': 'Erode',
  'திருப்பூர்': 'Tiruppur',
  'திண்டுக்கல்': 'Dindigul',
  'தஞ்சாவூர்': 'Thanjavur',
  'திருநெல்வேலி': 'Tirunelveli',
  'தூத்துக்குடி': 'Thoothukudi',
  'கன்னியாகுமரி': 'Kanyakumari',
  'நாமக்கல்': 'Namakkal',
  'கரூர்': 'Karur',
  'விழுப்புரம்': 'Viluppuram',
  'கடலூர்': 'Cuddalore',
  'நாகப்பட்டினம்': 'Nagapattinam',
  'சிவகங்கை': 'Sivaganga',
  'ராமநாதபுரம்': 'Ramanathapuram',
  'விருதுநகர்': 'Virudhunagar',
  'தேனி': 'Theni',
  'நீலகிரி': 'Nilgiris',
  'பெரம்பலூர்': 'Perambalur',
  'அரியலூர்': 'Ariyalur',
  'கிருஷ்ணகிரி': 'Krishnagiri',
  'தருமபுரி': 'Dharmapuri',
  'புதுச்சேரி': 'Puducherry',
  'இந்தியா': 'India'
};

export const sanitizeToEnglish = (text: string): string => {
  if (!text) return '';
  let cleaned = text;
  for (const [ta, en] of Object.entries(TAMIL_TO_ENGLISH_MAP)) {
    cleaned = cleaned.replace(new RegExp(ta, 'g'), en);
  }
  // Remove any remaining Tamil unicode block characters (\u0B80-\u0BFF)
  cleaned = cleaned.replace(/[\u0B80-\u0BFF]/g, '').trim();
  return cleaned.replace(/\s+/g, ' ').replace(/^,\s*|,\s*$/g, '').trim();
};

const POPULAR_CITIES = [
  { city: 'Chennai', pincode: '600017', state: 'Tamil Nadu' },
  { city: 'Bengaluru', pincode: '560001', state: 'Karnataka' },
  { city: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { city: 'Delhi NCR', pincode: '110001', state: 'Delhi' },
  { city: 'Hyderabad', pincode: '500001', state: 'Telangana' },
  { city: 'Coimbatore', pincode: '641001', state: 'Tamil Nadu' },
  { city: 'Madurai', pincode: '625001', state: 'Tamil Nadu' },
  { city: 'Kolkata', pincode: '700001', state: 'West Bengal' },
];

// Offline fallback for Indian postal circle prefixes
const getOfflineStateCityFromPin = (pin: string): { city: string; state: string } => {
  const p2 = parseInt(pin.slice(0, 2), 10);
  const p3 = parseInt(pin.slice(0, 3), 10);

  // Exact major city checks
  if (p3 === 600) return { city: 'Chennai', state: 'Tamil Nadu' };
  if (p3 === 641) return { city: 'Coimbatore', state: 'Tamil Nadu' };
  if (p3 === 625) return { city: 'Madurai', state: 'Tamil Nadu' };
  if (p3 === 620) return { city: 'Tiruchirappalli', state: 'Tamil Nadu' };
  if (p3 === 636) return { city: 'Salem', state: 'Tamil Nadu' };
  if (p3 === 560) return { city: 'Bengaluru', state: 'Karnataka' };
  if (p3 === 570) return { city: 'Mysuru', state: 'Karnataka' };
  if (p3 === 400) return { city: 'Mumbai', state: 'Maharashtra' };
  if (p3 === 411) return { city: 'Pune', state: 'Maharashtra' };
  if (p3 === 440) return { city: 'Nagpur', state: 'Maharashtra' };
  if (p3 === 110) return { city: 'New Delhi', state: 'Delhi' };
  if (p3 === 500) return { city: 'Hyderabad', state: 'Telangana' };
  if (p3 === 700) return { city: 'Kolkata', state: 'West Bengal' };
  if (p3 === 380) return { city: 'Ahmedabad', state: 'Gujarat' };
  if (p3 === 395) return { city: 'Surat', state: 'Gujarat' };
  if (p3 === 302) return { city: 'Jaipur', state: 'Rajasthan' };
  if (p3 === 226) return { city: 'Lucknow', state: 'Uttar Pradesh' };
  if (p3 === 682) return { city: 'Kochi', state: 'Kerala' };
  if (p3 === 695) return { city: 'Thiruvananthapuram', state: 'Kerala' };
  if (p3 === 800) return { city: 'Patna', state: 'Bihar' };
  if (p3 === 751) return { city: 'Bhubaneswar', state: 'Odisha' };
  if (p3 === 781) return { city: 'Guwahati', state: 'Assam' };
  if (p3 === 160) return { city: 'Chandigarh', state: 'Chandigarh' };

  // Regional 2-digit Circle prefix fallback
  if (p2 === 11) return { city: 'Delhi', state: 'Delhi' };
  if (p2 === 12 || p2 === 13) return { city: 'Haryana', state: 'Haryana' };
  if (p2 >= 14 && p2 <= 16) return { city: 'Punjab', state: 'Punjab' };
  if (p2 === 17) return { city: 'Himachal Pradesh', state: 'Himachal Pradesh' };
  if (p2 === 18 || p2 === 19) return { city: 'Jammu & Kashmir', state: 'Jammu & Kashmir' };
  if (p2 >= 20 && p2 <= 28) return { city: 'Uttar Pradesh', state: 'Uttar Pradesh' };
  if (p2 >= 30 && p2 <= 34) return { city: 'Rajasthan', state: 'Rajasthan' };
  if (p2 >= 36 && p2 <= 39) return { city: 'Gujarat', state: 'Gujarat' };
  if (p2 >= 40 && p2 <= 44) return { city: 'Maharashtra', state: 'Maharashtra' };
  if (p2 >= 45 && p2 <= 49) return { city: 'Madhya Pradesh', state: 'Madhya Pradesh' };
  if (p2 >= 50 && p2 <= 53) return { city: 'Andhra / Telangana', state: 'Telangana' };
  if (p2 >= 56 && p2 <= 59) return { city: 'Karnataka', state: 'Karnataka' };
  if (p2 >= 60 && p2 <= 64) return { city: 'Tamil Nadu', state: 'Tamil Nadu' };
  if (p2 >= 67 && p2 <= 69) return { city: 'Kerala', state: 'Kerala' };
  if (p2 >= 70 && p2 <= 74) return { city: 'West Bengal', state: 'West Bengal' };
  if (p2 >= 75 && p2 <= 77) return { city: 'Odisha', state: 'Odisha' };
  if (p2 === 78) return { city: 'Assam', state: 'Assam' };
  if (p2 === 79) return { city: 'North East', state: 'North East' };
  if (p2 >= 80 && p2 <= 85) return { city: 'Bihar / Jharkhand', state: 'Bihar' };

  return { city: 'India', state: 'India' };
};

export const DeliveryLocationBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { location, setIsLocationModalOpen } = useLocation();

  return (
    <div
      onClick={() => setIsLocationModalOpen(true)}
      className={`inline-flex items-center gap-1.5 text-xs cursor-pointer select-none py-1 transition-opacity hover:opacity-90 ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Select delivery location"
    >
      <MapPin className="w-4 h-4 text-black shrink-0" />
      {location.isSet ? (
        <span className="flex items-center gap-1.5 flex-wrap">
          <strong className="text-black font-bold">
            Deliver to {location.city} - {location.pincode}
          </strong>
          <span className="text-[#0070E0] hover:underline font-semibold flex items-center gap-0.5">
            Change <ChevronRight className="w-3 h-3 text-[#0070E0]" />
          </span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 flex-wrap">
          <strong className="text-black font-bold">Location not set</strong>
          <span className="text-[#0070E0] hover:underline font-semibold flex items-center gap-0.5">
            Select delivery location <ChevronRight className="w-3 h-3 text-[#0070E0]" />
          </span>
        </span>
      )}
    </div>
  );
};

export const DeliveryLocationModal: React.FC = () => {
  const { location, setLocation, isLocationModalOpen, setIsLocationModalOpen } = useLocation();
  const [pincodeInput, setPincodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleApplyPincode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = pincodeInput.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN Code (e.g. 560001, 600017)');
      return;
    }

    setIsLookingUp(true);
    setErrorMsg('');

    try {
      // 1. Try official Indian Postal Pincode API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const rawCity = po.District || po.Block || po.Name || 'India';
          const rawState = po.State || 'India';
          const city = sanitizeToEnglish(rawCity);
          const state = sanitizeToEnglish(rawState);

          setLocation({
            pincode: cleaned,
            city,
            state,
            isSet: true,
          });
          setIsLookingUp(false);
          setPincodeInput('');
          setIsLocationModalOpen(false);
          return;
        }
      }
    } catch {
      // Fall through to offline lookup if network request fails or times out
    }

    // 2. Offline Fallback Lookup
    const fallback = getOfflineStateCityFromPin(cleaned);
    setLocation({
      pincode: cleaned,
      city: fallback.city,
      state: fallback.state,
      isSet: true,
    });

    setIsLookingUp(false);
    setPincodeInput('');
    setIsLocationModalOpen(false);
  };

  const handleSelectCity = (c: typeof POPULAR_CITIES[0]) => {
    setLocation({
      pincode: c.pincode,
      city: c.city,
      state: c.state,
      isSet: true,
    });
    setErrorMsg('');
    setIsLocationModalOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // 1. Try OpenStreetMap Nominatim with strict English language
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`,
            {
              signal: controller.signal,
              headers: {
                'Accept-Language': 'en-US,en;q=1.0',
                'User-Agent': 'KavisLifestyleEcommerce/1.0',
              },
            }
          );
          clearTimeout(timeoutId);

          if (nomRes.ok) {
            const nomData = await nomRes.json();
            const addr = nomData.address || {};
            const pin = (addr.postcode || '').replace(/\D/g, '').slice(0, 6);
            const rawCity = addr.city || addr.town || addr.suburb || addr.county || addr.state_district || '';
            const rawState = addr.state || 'India';
            const city = sanitizeToEnglish(rawCity);
            const state = sanitizeToEnglish(rawState);
            const area = sanitizeToEnglish(addr.suburb || addr.neighbourhood || addr.road || '');

            if (pin && pin.length === 6) {
              // Try resolving official Post Office in English via India Post
              try {
                const poRes = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                if (poRes.ok) {
                  const poData = await poRes.json();
                  if (poData?.[0]?.Status === 'Success' && poData[0]?.PostOffice?.length > 0) {
                    const po = poData[0].PostOffice[0];
                    setLocation({
                      pincode: pin,
                      city: sanitizeToEnglish(po.District || city || 'India'),
                      state: sanitizeToEnglish(po.State || state || 'India'),
                      area: area || sanitizeToEnglish(po.Name || ''),
                      isSet: true,
                    });
                    setIsDetecting(false);
                    setIsLocationModalOpen(false);
                    return;
                  }
                }
              } catch {
                // fall through
              }

              setLocation({
                pincode: pin,
                city: city || 'India',
                state: state || 'India',
                area,
                isSet: true,
              });
              setIsDetecting(false);
              setIsLocationModalOpen(false);
              return;
            } else if (city) {
              // Search post office by town name
              try {
                const poRes = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`);
                if (poRes.ok) {
                  const poData = await poRes.json();
                  if (poData?.[0]?.Status === 'Success' && poData[0]?.PostOffice?.length > 0) {
                    const po = poData[0].PostOffice[0];
                    const poPin = (po.Pincode || '').replace(/\D/g, '').slice(0, 6);
                    if (poPin && poPin.length === 6) {
                      setLocation({
                        pincode: poPin,
                        city: sanitizeToEnglish(po.District || city),
                        state: sanitizeToEnglish(po.State || state),
                        area: sanitizeToEnglish(po.Name || ''),
                        isSet: true,
                      });
                      setIsDetecting(false);
                      setIsLocationModalOpen(false);
                      return;
                    }
                  }
                }
              } catch {
                // fall through
              }
            }
          }
        } catch {
          // fall through
        }

        // 2. Fallback to BigDataCloud reverse geocoding with English forced
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const rawPostcode = data.postcode || '';
            const cleanPin = rawPostcode.replace(/\D/g, '').slice(0, 6);
            const city = sanitizeToEnglish(data.city || data.locality || data.principalSubdivision || '');
            const state = sanitizeToEnglish(data.principalSubdivision || 'India');

            if (cleanPin && cleanPin.length === 6) {
              setLocation({
                pincode: cleanPin,
                city: city || 'India',
                state,
                isSet: true,
              });
              setIsDetecting(false);
              setIsLocationModalOpen(false);
              return;
            }
          }
        } catch {
          // fall through
        }

        setIsDetecting(false);
        setErrorMsg('Location detected roughly, but exact 6-digit PIN is needed. Please enter your 6-digit PIN code below.');
      },
      (err) => {
        setIsDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Location permission was denied. Please enter your 6-digit PIN code manually below.');
        } else {
          setErrorMsg('Unable to retrieve location. Please enter your 6-digit PIN code manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5DCD3] relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsLocationModalOpen(false)}
          className="absolute right-5 top-5 p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-[#FAF6F2] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#FAF6F2] border border-[#E5DCD3] flex items-center justify-center text-black">
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-black">
              Choose Delivery Location
            </h3>
            <p className="text-xs text-[#5C554E]">
              Check delivery timelines & shipping availability for your address
            </p>
          </div>
        </div>

        {/* Current Location Detect Button */}
        <div className="mt-4 pt-3 border-t border-[#E5DCD3]">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className="w-full py-2.5 px-3 bg-[#FAF6F2] hover:bg-[#EFE8E0] text-black font-bold text-xs rounded-xl border border-[#E5DCD3] flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
          >
            {isDetecting ? (
              <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-black" />
            )}
            <span>{isDetecting ? 'Detecting your GPS location...' : 'Use my current location'}</span>
          </button>
        </div>

        {/* Or Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#E5DCD3]" />
          <span className="px-3 text-[11px] font-bold text-[#5C554E] uppercase tracking-wider">
            OR ENTER PIN CODE
          </span>
          <div className="flex-1 border-t border-[#E5DCD3]" />
        </div>

        {/* PIN Code Form */}
        <form onSubmit={handleApplyPincode} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={pincodeInput}
              onChange={(e) => {
                setPincodeInput(e.target.value.replace(/\D/g, ''));
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Enter 6-digit Indian PIN (e.g. 560001, 400001)"
              className="flex-1 px-3.5 py-2.5 text-xs font-semibold border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
            />
            <button
              type="submit"
              disabled={isLookingUp}
              className="px-5 py-2.5 bg-black hover:bg-[#2A2A2A] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              {isLookingUp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Apply</span>
            </button>
          </div>
          {errorMsg && (
            <p className="text-[11px] text-red-600 font-semibold">{errorMsg}</p>
          )}
        </form>

        {/* Quick Select Cities */}
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C554E] mb-2">
            Popular Cities
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {POPULAR_CITIES.map((c) => {
              const isSelected = location.pincode === c.pincode;
              return (
                <button
                  key={c.pincode}
                  type="button"
                  onClick={() => handleSelectCity(c)}
                  className={`p-2 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-[#FAF6F2] hover:bg-white text-black border-[#E5DCD3]'
                  }`}
                >
                  <span className="truncate">{c.city}</span>
                  {isSelected && <Check className="w-3 h-3 text-white shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery Timeline Indicator */}
        <div className="mt-5 pt-3 border-t border-[#E5DCD3] text-[11px] text-[#5C554E] space-y-1">
          <p className="font-semibold text-black">
            ⚡ Metro Cities: Express Delivery in 24–48 Hours
          </p>
          <p>
            📦 Pan-India Courier Dispatched via Bluedart & Delhivery with Live SMS Tracking
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLocationModal;
