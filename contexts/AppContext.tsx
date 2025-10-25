'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Storm, GeoJSONFeature } from '../libs/hurdat';

interface AppContextType {
  basin: string;
  setBasin: (basin: string) => void;
  year: number;
  setYear: (year: number) => void;
  season: Storm[] | null;
  setSeason: (season: Storm[] | null) => void;
  storm: Storm | null;
  setStorm: (storm: Storm | null) => void;
  stormId: string;
  setStormId: (stormId: string) => void;
  dates: string[];
  landfallingStorms: Storm[];
  windField: boolean;
  setWindField: (windField: boolean) => void;
  names: string[];
  ACE: number;
  ACEArray: number[];
  TIKE: number;
  TIKEArray: number[];
  maxWinds: number[];
  seasonACE: number[];
  liveHurdat: GeoJSONFeature[];
  forecastCone: GeoJSONFeature[];
  toggleTracker: () => void;
  tracker: boolean;
  windFieldForecast: GeoJSONFeature[];
  toggleCharts: () => void;
  map: boolean;
  areasOfInterest: GeoJSONFeature[];
  setAreasOfInterest: (areas: GeoJSONFeature[]) => void;
  selectedLiveStorm: string | null;
  selectLiveStorm: (stormId: string) => void;
  pointsOfInterest: GeoJSONFeature[];
  clickedPoint: { lat: number; lng: number } | null;
  selectArchivedStormPoint: (stormId: string, lat: number, lng: number) => void;
  selectLiveStormPoint: (stormId: string, lat: number, lng: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
  value: AppContextType;
}

export const AppProvider = ({ children, value }: AppProviderProps) => {
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
