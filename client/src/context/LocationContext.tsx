import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DeliveryLocation {
  pincode: string;
  city: string;
  state: string;
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
  const [location, setLocationState] = useState<DeliveryLocation>(() => {
    try {
      const saved = localStorage.getItem('kavis_delivery_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const setLocation = (loc: DeliveryLocation) => {
    setLocationState(loc);
    try {
      localStorage.setItem('kavis_delivery_location', JSON.stringify(loc));
    } catch (e) {
      console.error('Failed to save delivery location', e);
    }
  };

  const resetLocation = () => {
    setLocationState(DEFAULT_LOCATION);
    try {
      localStorage.removeItem('kavis_delivery_location');
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
