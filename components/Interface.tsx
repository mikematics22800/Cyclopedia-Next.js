'use client';

import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import StormArchive from "./StormArchive";
import SeasonArchive from "./SeasonArchive";
// Removed MUI imports - using native HTML elements
import Charts from "./ArchiveCharts";
import LiveTracker from "./LiveTracker";

const Interface = () => {
  const { 
    basin, 
    setBasin, 
    year, 
    setYear, 
    stormId, 
    setStormId, 
    setWindField, 
    season, 
    tracker, 
    toggleCharts, 
    map 
  } = useAppContext();

  const startYear = basin === 'atl' ? 1850 : 1948;
  const years = new Array(2024 - startYear).fill(0);

  const [stormIds, setStormIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (season) {
      const stormIds = season.map((storm) => {
        return storm.id;
      });
      setStormIds(stormIds);
    }
  }, [season]);

  return (
    <div className='interface'>
      <div className="bg-gray-300 rounded-full w-20 h-1 md:hidden"/>
      {!tracker && (
        <>
          <div className="selectors">
            <select className="select" value={basin} onChange={(e) => {setBasin(e.target.value)}}>
              <option value="atl">Atlantic</option>
              <option value="pac">Pacific</option>
            </select>
            <select className="select" value={year} onChange={(e) => {setYear(Number(e.target.value))}}>
              {years.map((_, index) => {
                const selectedYear = 2024 - index;
                return (<option key={index} value={selectedYear}>{selectedYear}</option>);
              })}
            </select>
            <select className="select" value={stormId} onChange={(e) => {setStormId(e.target.value)}}>
              {stormIds?.map((id) => {
                const name = id.split('_')[1];
                return (<option key={id} value={id}>{name}</option>);
              })}
            </select>
          </div>
          {year >= 2004 && (
            <div className="flex items-center gap-1">
              <input type="checkbox" className="!text-white !p-0" onChange={(e) => {setWindField(e.target.checked)}}/>
              <h1 className="text-white font-bold">Wind Field</h1>
            </div>
          )}
          <StormArchive/>
          <SeasonArchive/>
          <div className="hidden sm:flex justify-center mt-4 w-full">
            <button className="button" onClick={toggleCharts}>
              <h1>{map ? "Charts" : "Map"}</h1>
            </button>
          </div>
        </>
      )}
      {tracker && <LiveTracker />}
      {!tracker && (
        <>
          <div className="md:hidden mt-4 w-full">
            <Charts/>
          </div>
        </>
      )}
    </div>
  );
};

export default Interface;
