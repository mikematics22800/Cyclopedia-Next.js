'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getArchive, getLive, getCone } from "../libs/hurdat";
import { sum } from "../libs/sum";
import { AppProvider } from "../contexts/AppContext";
import Interface from "../components/Interface";
const Map = dynamic(() => import("../components/Map"), { ssr: false });
import ArchiveCharts from "../components/ArchiveCharts";
import LoadingScreen from "../components/LoadingScreen";

export default function App() {
  const [basin, setBasin] = useState<string>('atl');
  const [year, setYear] = useState<number>(2024);
  const [season, setSeason] = useState<any[] | null>(null);
  const [storm, setStorm] = useState<any | null>(null);
  const [stormId, setStormId] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [windField, setWindField] = useState<boolean>(false);
  const [names, setNames] = useState<string[]>([]);
  const [seasonACE, setSeasonACE] = useState<number[]>([]);
  const [map, setMap] = useState<boolean>(true);
  const [maxWinds, setMaxWinds] = useState<number[]>([]);
  const [liveHurdat, setLiveHurdat] = useState<any[]>([]);
  const [forecastCone, setForecastCone] = useState<any[]>([]);
  const [tracker, setTracker] = useState<boolean>(false);
  const [liveStormId, setLiveStormId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
    getLive().then(data => {
      setLiveHurdat(data || []);
    });
    getCone().then(data => {
      setForecastCone(data || []);
    });  
  }, []);

  useEffect(() => {
    if (year < 1949 && basin === 'pac') setYear(1949);
    if (typeof window !== 'undefined') {
      const cache = localStorage.getItem(`cyclopedia-${basin}-${year}`);
      if (cache) {
        setSeason(JSON.parse(cache));
        const data = JSON.parse(cache);
        setStormId(data[0].id);
      } else {
        setSeason(null);
        setStorm(null);
        getArchive(basin, year).then(data => {
          if (data) {
            setSeason(data);
            if (data[0]) {
              setStormId(data[0].id);
            }
            localStorage.setItem(`cyclopedia-${basin}-${year}`, JSON.stringify(data));
          }
        });
      }
    }
  }, [basin, year]);

  useEffect(() => {
    if (season) {
      const storm = season.find(storm => storm.id === stormId);
      setStorm(storm);
    }
  }, [stormId, season]);

  useEffect(() => {
    if (storm) {
      const dates = storm.data.map((point: any) => {
        const dateArray = point?.date.toString().split("");
        const month = dateArray.slice(4,6).join("");
        const day = dateArray.slice(-2).join("");
        return `${month}/${day}`;
      });
      setDates(dates);
    }
  }, [storm, year]);

  useEffect(() => {
    if (season) {
      const names = season.map((storm) => {
        return storm.id.split('_')[1];
      });
      setNames(names);
  
      const maxWinds = season.map((storm) => {
        const winds = storm.data.map((point: any) => {
          return point.max_wind_kt;
        });
        return Math.max(...winds);
      });
      setMaxWinds(maxWinds);
  
      const seasonACE = season.map((storm) => {
        let ACE = 0;
        let windArray: number[] = [];
        storm.data.forEach((point: any) => {
          const wind = point.max_wind_kt;
          const hour = point.time_utc;
          if (["TS", "SS", "HU"].includes(point.status)) {
            if (hour % 600 == 0) {
              ACE += Math.pow(wind, 2)/10000;
              if (windArray.length > 0) {
                const average = sum(windArray)/windArray.length;
                ACE += Math.pow(average, 2)/10000;
                windArray = [];
              }
            } else {
              windArray.push(wind);
            }
          }
        });
        return ACE;
      });
      setSeasonACE(seasonACE);

      // Calculate season TIKE if year >= 2004
      if (year >= 2004) {
        const seasonTIKE = season.map((storm) => {
          let cumulativeTIKE = 0;
          storm.data.forEach((point: any) => {
            if (point['34kt_wind_nm'] && point['50kt_wind_nm'] && point['64kt_wind_nm']) {
              const wind34 = point['34kt_wind_nm'];
              const wind50 = point['50kt_wind_nm'];
              const wind64 = point['64kt_wind_nm'];
              
              const area34 = Math.PI * Math.pow((wind34.ne + wind34.se + wind34.sw + wind34.nw) / 4 * 1852, 2);
              const area50 = Math.PI * Math.pow((wind50.ne + wind50.se + wind50.sw + wind50.nw) / 4 * 1852, 2);
              const area64 = Math.PI * Math.pow((wind64.ne + wind64.se + wind64.sw + wind64.nw) / 4 * 1852, 2);
              
              const rho = 1.15;
              const v34 = 34 * 0.514444;
              const v50 = 50 * 0.514444;
              const v64 = 64 * 0.514444;
              
              const ke34 = 0.5 * rho * Math.pow(v34, 2) * area34;
              const ke50 = 0.5 * rho * Math.pow(v50, 2) * area50;
              const ke64 = 0.5 * rho * Math.pow(v64, 2) * area64;
              
              const totalKE = ke34 + ke50 + ke64;
              const totalKETJ = totalKE / 1e12;
              
              cumulativeTIKE += totalKETJ;
            }
          });
          return cumulativeTIKE;
        });
      }
    }
  }, [season, year]);

  const toggleCharts = useCallback(() => {
    setMap(prev => !prev);
  }, []);

  const toggleTracker = useCallback(() => {
    setTracker(prev => !prev);
  }, []);

  const value = useMemo(() => ({
    basin,
    setBasin, 
    year, 
    setYear, 
    season, 
    storm, 
    stormId, 
    setStormId, 
    dates, 
    windField, 
    setWindField,
    names,
    maxWinds,
    seasonACE,
    liveHurdat,
    forecastCone,
    tracker,
    liveStormId,
    setLiveStormId
  }), [
    basin,
    setBasin,
    year,
    setYear,
    season,
    storm,
    stormId,
    setStormId,
    dates,
    windField,
    setWindField,
    names,
    maxWinds,
    seasonACE,
    liveHurdat,
    forecastCone,
    tracker,  
    liveStormId,
    setLiveStormId
  ]);

  return (
    <AppProvider value={value}>
      <div className="app app-background">
        {season && storm ? (
          <>
            <nav>
              <div className="flex items-center">
                <Image src="/cyclone.png" alt="Cyclopedia" width={40} height={40} className="mr-2" priority unoptimized />
                <h1 className="storm-font text-4xl text-white italic hidden sm:block">CYCLOPEDIA</h1>
              </div>
              <div className="flex items-center gap-5">
                {!tracker && <button className="button !hidden sm:!flex" onClick={toggleCharts}>
                  <h1>{map ? "Charts" : "Map"}</h1>
                </button>}
                <button className="button" onClick={toggleTracker}>
                  <h1>{tracker ? "Historical Archive" : "Live Tracker"}</h1>
                </button>
              </div>
            </nav>
            <div className="desktop-view">
              <Interface/>
              {map ? <Map/> : tracker ? <Map/> : <ArchiveCharts/>}
            </div>
            <div className="mobile-map">
              <Map/>
            </div>  
            <div className="mobile-interface">
              <Interface/>
            </div>
          </>
        ) : (
          <LoadingScreen />
        )}
      </div>
    </AppProvider>
  );
}
