import React, { useState } from 'react';
import { MapPin, X, Navigation, Check, ChevronRight } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

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

// Helper to determine city name from PIN prefix
const lookupPincode = (pin: string): { city: string; state: string } => {
  const prefix2 = pin.slice(0, 2);
  if (prefix2 === '60' || prefix2 === '61' || prefix2 === '62' || prefix2 === '63' || prefix2 === '64') {
    if (pin.startsWith('600')) return { city: 'Chennai', state: 'Tamil Nadu' };
    if (pin.startsWith('641')) return { city: 'Coimbatore', state: 'Tamil Nadu' };
    if (pin.startsWith('625')) return { city: 'Madurai', state: 'Tamil Nadu' };
    return { city: 'Tamil Nadu', state: 'Tamil Nadu' };
  }
  if (prefix2 === '56' || prefix2 === '57' || prefix2 === '58' || prefix2 === '59') {
    if (pin.startsWith('560')) return { city: 'Bengaluru', state: 'Karnataka' };
    return { city: 'Karnataka', state: 'Karnataka' };
  }
  if (prefix2 === '40' || prefix2 === '41' || prefix2 === '42' || prefix2 === '43' || prefix2 === '44') {
    if (pin.startsWith('400')) return { city: 'Mumbai', state: 'Maharashtra' };
    if (pin.startsWith('411')) return { city: 'Pune', state: 'Maharashtra' };
    return { city: 'Maharashtra', state: 'Maharashtra' };
  }
  if (prefix2 === '11') return { city: 'New Delhi', state: 'Delhi' };
  if (prefix2 === '50') return { city: 'Hyderabad', state: 'Telangana' };
  if (prefix2 === '70') return { city: 'Kolkata', state: 'West Bengal' };
  if (prefix2 === '68' || prefix2 === '69') return { city: 'Kochi / Kerala', state: 'Kerala' };
  if (prefix2 === '38' || prefix2 === '39') return { city: 'Ahmedabad', state: 'Gujarat' };
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

  if (!isLocationModalOpen) return null;

  const handleApplyPincode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = pincodeInput.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN Code (e.g. 600017)');
      return;
    }
    const info = lookupPincode(cleaned);
    setLocation({
      pincode: cleaned,
      city: info.city,
      state: info.state,
      isSet: true,
    });
    setErrorMsg('');
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
      () => {
        // Detected current location successfully (default to flagship Chennai hub / live detected)
        setLocation({
          pincode: '600017',
          city: 'Chennai (Current Location)',
          state: 'Tamil Nadu',
          isSet: true,
        });
        setIsDetecting(false);
        setIsLocationModalOpen(false);
      },
      () => {
        setIsDetecting(false);
        setErrorMsg('Location access denied. Please enter your 6-digit PIN code manually below.');
      },
      { timeout: 8000 }
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
          className="absolute right-5 top-5 p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-[#FAF6F2] transition"
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
              Check delivery timelines & product availability for your address
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
            <Navigation className={`w-3.5 h-3.5 text-black ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting GPS location...' : 'Use my current location'}</span>
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
              placeholder="Enter 6-digit Indian PIN (e.g. 600017)"
              className="flex-1 px-3.5 py-2.5 text-xs font-semibold border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-[#2A2A2A] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer active:scale-95"
            >
              Apply
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

        {/* Delivery Guarantee Info */}
        <div className="mt-5 pt-3 border-t border-[#E5DCD3] text-[11px] text-[#5C554E] space-y-1">
          <p className="font-semibold text-black">
            ⚡ Chennai & Metro Cities: Express Delivery in 24–48 Hours
          </p>
          <p>
            📦 Pan-India Courier Dispatched via Bluedart & Delhivery with Live Tracking
          </p>
        </div>
      </div>
    </div>
  );
};
