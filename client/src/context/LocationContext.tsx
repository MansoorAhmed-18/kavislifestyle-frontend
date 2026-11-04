import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface DeliveryLocation {
  pincode: string;
  city: string;
  state: string;
  area?: string;
  formattedAddress?: string;
  isSet: boolean;
}

interface LocationContextType {
  location: DeliveryLocation;
  setLocation: (loc: DeliveryLocation) => void;
  resetLocation: () => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
}

const DEFAULT_LOCATION: DeliveryLocation = {
  pincode: '',
  city: '',
  state: '',
  isSet: false,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addresses } = useAuth();
  const userKey = user?.email ? user.email.toLowerCase().trim() : 'guest';
  const storageKey = `kavis_delivery_loc_${userKey}`;

  // Purge any legacy shared/corrupted global location keys
  useEffect(() => {
    try {
      localStorage.removeItem('kavis_delivery_location');
    } catch {
      // ignore
    }
  }, []);

  const [location, setLocationState] = useState<DeliveryLocation>(() => {
    // 1. If active user has a saved address, default to their saved address
    if (user && addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      if (defaultAddr && defaultAddr.city && defaultAddr.postalCode) {
        return {
          pincode: defaultAddr.postalCode,
          city: defaultAddr.city,
          state: defaultAddr.state || 'India',
          area: defaultAddr.street || '',
          isSet: true,
        };
      }
    }

    // 2. Otherwise load this specific user/guest scoped location
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !(parsed.city === 'Thiruthani' && parsed.pincode === '600017')) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    return DEFAULT_LOCATION;
  });

  // Re-sync delivery location whenever user logs in, logs out, or switches accounts
  useEffect(() => {
    if (user) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      if (defaultAddr && defaultAddr.city && defaultAddr.postalCode) {
        setLocationState({
          pincode: defaultAddr.postalCode,
          city: defaultAddr.city,
          state: defaultAddr.state || 'India',
          area: defaultAddr.street || '',
          isSet: true,
        });
        return;
      }

      try {
        const saved = localStorage.getItem(`kavis_delivery_loc_${user.email.toLowerCase().trim()}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && !(parsed.city === 'Thiruthani' && parsed.pincode === '600017')) {
            setLocationState(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }

      setLocationState(DEFAULT_LOCATION);
    } else {
      // When logged out, reset to guest or default un-set
      try {
        const guestSaved = localStorage.getItem('kavis_delivery_loc_guest');
        if (guestSaved) {
          const parsed = JSON.parse(guestSaved);
          if (parsed && !(parsed.city === 'Thiruthani' && parsed.pincode === '600017')) {
            setLocationState(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
      setLocationState(DEFAULT_LOCATION);
    }
  }, [user?.email, addresses]);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const setLocation = (loc: DeliveryLocation) => {
    setLocationState(loc);
    try {
      localStorage.setItem(storageKey, JSON.stringify(loc));
    } catch (e) {
      console.error('Failed to save delivery location', e);
    }
  };

  const resetLocation = () => {
    setLocationState(DEFAULT_LOCATION);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error('Failed to reset delivery location', e);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        resetLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

