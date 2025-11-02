'use client';

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { getArchive, getLive, getCone, getInvestArea, getInvest } from "../libs/hurdat";
import { sum } from "../libs/sum";
import { AppProvider } from "../contexts/AppContext";
import Interface from "../components/Interface";
const Map = dynamic(() => import("../components/Map"), { ssr: false });
import ArchiveCharts from "../components/ArchiveCharts";
import LoadingScreen from "../components/LoadingScreen";

export default function Home() {
  const [basin, setBasin] = useState<string>('atl');
  const [year, setYear] = useState<number>(2024);
  const [season, setSeason] = useState<any[] | null>(null);
  const [storm, setStorm] = useState<any | null>(null);
  const [stormId, setStormId] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [landfallingStorms, setLandfallingStorms] = useState<any[]>([]);
  const [windField, setWindField] = useState<boolean>(false);
  const [names, setNames] = useState<string[]>([]);
  const [ACE, setACE] = useState<number>(0);
  const [ACEArray, setACEArray] = useState<number[]>([]);
  const [seasonACE, setSeasonACE] = useState<number[]>([]);
  const [TIKE, setTIKE] = useState<number>(0);
  const [TIKEArray, setTIKEArray] = useState<number[]>([]);
  const [map, setMap] = useState<boolean>(true);
  const [maxWinds, setMaxWinds] = useState<number[]>([]);
  const [liveHurdat, setLiveHurdat] = useState<any[]>([]);
  const [forecastCone, setForecastCone] = useState<any[]>([]);
  const [tracker, setTracker] = useState<boolean>(false);
  const [investAreas, setinvestAreas] = useState<any[]>([]);
  const [selectedLiveStorm, setSelectedLiveStorm] = useState<string | null>(null);
  const [invests, setInvests] = useState<any[]>([]);
  const [clickedPoint, setClickedPoint] = useState<{ lat: number; lng: number } | null>(null);

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
    getInvestArea().then(data => {
      setinvestAreas(data || []);
    });
    getInvest().then(data => {
      setInvests(data || []);
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

      const data = storm.data;
      let ACEPoint = 0;
      let windArray: number[] = [];
      const ACEArray = data.map((point: any) => {
        const wind = point.max_wind_kt;
        const hour = parseInt(point.time_utc);
        if (["TS", "SS", "HU"].includes(point.status)) {
          if (hour % 600 == 0) {
            ACEPoint += Math.pow(wind, 2)/10000;
            if (windArray.length > 0) {
              const average = sum(windArray)/windArray.length;
              ACEPoint += Math.pow(average, 2)/10000;
              windArray = [];
            }
          } else {
            windArray.push(wind);
          }
        }
        return ACEPoint;
      });
      setACEArray(ACEArray);
      const ACE = Math.max(...ACEArray);
      setACE(ACE);

      // Calculate TIKE if year >= 2004 and wind radii data is available
      if (year >= 2004) {
        let tikeArray: number[] = [];
        let cumulativeTIKE = 0;
        
        data.forEach((point: any) => {
          if (point['34kt_wind_nm'] && point['50kt_wind_nm'] && point['64kt_wind_nm']) {
            const wind34 = point['34kt_wind_nm'];
            const wind50 = point['50kt_wind_nm'];
            const wind64 = point['64kt_wind_nm'];
            
            // Calculate area of wind field for each wind speed threshold
            const area34 = Math.PI * Math.pow((wind34.ne + wind34.se + wind34.sw + wind34.nw) / 4 * 1852, 2);
            const area50 = Math.PI * Math.pow((wind50.ne + wind50.se + wind50.sw + wind50.nw) / 4 * 1852, 2);
            const area64 = Math.PI * Math.pow((wind64.ne + wind64.se + wind64.sw + wind64.nw) / 4 * 1852, 2);
            
            // Calculate kinetic energy for each wind speed threshold
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
            tikeArray.push(cumulativeTIKE);
          } else {
            tikeArray.push(cumulativeTIKE);
          }
        });
        
        setTIKEArray(tikeArray);
        const finalTIKE = Math.max(...tikeArray);
        setTIKE(finalTIKE);
      } else {
        setTIKEArray([]);
        setTIKE(0);
      }
    }
  }, [storm, year]);

  useEffect(() => {
    const landfallingStorms: any[] = [];
    if (season) {
      season.forEach((storm) => {
        const hasLandfall = storm.data.some((point: any) => point.record === "L");
        if (hasLandfall) {
          landfallingStorms.push(storm);
        }
      });
      setLandfallingStorms(landfallingStorms);
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
        // Note: seasonTIKE could be added to context if needed elsewhere
      }
    }
  }, [season, year]);

  const toggleCharts = () => {
    if (map === false) {
      setMap(true);
    } else {
      setMap(false);
    }
  };

  const toggleTracker = () => {
    if (tracker === false) {
      setTracker(true);
    } else {
      setTracker(false);
    }
  };

  const selectLiveStorm = (stormId: string) => {
    setSelectedLiveStorm(stormId);
    
    // Find the current position of the selected storm and focus on it
    if (liveHurdat && liveHurdat.length > 0) {
      const stormPoints = liveHurdat.filter((feature: any) => feature.properties.STORM_ID === stormId);
      
      if (stormPoints && stormPoints.length > 0) {
        // Group by advisory number to find the latest position
        const advisories: any = {};
        stormPoints.forEach((point: any) => {
          const advisoryNum = parseInt(point.properties.ADVISNUM);
          if (!advisories[advisoryNum]) {
            advisories[advisoryNum] = [];
          }
          advisories[advisoryNum].push(point);
        });
        
        // Find the latest advisory
        const latestAdvisoryNum = Math.max(...Object.keys(advisories).map(Number));
        const latestAdvisoryPoints = advisories[latestAdvisoryNum];
        
        if (latestAdvisoryPoints && latestAdvisoryPoints.length > 0) {
          // Parse dates to sort by time
          const parseDate = (dateStr: string) => {
            try {
              const parts = dateStr.split(" ");
              if (parts.length !== 7) return new Date(0);
              const [time, ampm, timezone, dayOfWeek, month, date, year] = parts;
              const hours = time.slice(0, -2);
              const minutes = time.slice(-2);
              let hour24 = parseInt(hours);
              if (ampm === "PM" && hour24 !== 12) hour24 += 12;
              else if (ampm === "AM" && hour24 === 12) hour24 = 0;
              return new Date(`${month} ${date} ${year} ${hour24}:${minutes}:00`);
            } catch {
              return new Date(0);
            }
          };
          
          // Sort points by date to get the most current
          latestAdvisoryPoints.sort((a: any, b: any) => {
            const dateA = parseDate(a.properties.ADVDATE);
            const dateB = parseDate(b.properties.ADVDATE);
            return dateB.getTime() - dateA.getTime();
          });
          
          // Get the most recent point
          const currentPoint = latestAdvisoryPoints[0];
          const [lng, lat] = currentPoint.geometry.coordinates[0];
          setClickedPoint({ lat, lng });
        }
      }
    }
  };

  const selectArchivedStormPoint = (stormId: string, lat: number, lng: number) => {
    setStormId(stormId);
    setClickedPoint({ lat, lng });
  };

  const selectLiveStormPoint = (stormId: string, lat: number, lng: number) => {
    setSelectedLiveStorm(stormId);
    setClickedPoint({ lat, lng });
  };

  const value = {
    basin,
    setBasin, 
    year, 
    setYear, 
    season, 
    setSeason, 
    storm, 
    setStorm, 
    stormId, 
    setStormId, 
    dates, 
    landfallingStorms, 
    windField, 
    setWindField,
    names,
    ACE,
    ACEArray,
    TIKE,
    TIKEArray,
    maxWinds,
    seasonACE,
    liveHurdat,
    forecastCone,
    toggleTracker,
    tracker,
    toggleCharts,
    map,
    investAreas,
    setinvestAreas,
    selectedLiveStorm,
    selectLiveStorm,
    invests,
    clickedPoint,
    selectArchivedStormPoint,
    selectLiveStormPoint
  };

  return (
    <AppProvider value={value}>
      <div className="app app-background">
        {season && storm ? (
          <>
            <nav>
              <div className="flex items-center">
                <img src="/cyclone.png" className="h-10 mr-2"/>
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
