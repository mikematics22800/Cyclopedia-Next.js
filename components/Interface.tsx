'use client';

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../contexts/AppContext";
import StormArchive from "./StormArchive";
import SeasonArchive from "./SeasonArchive";
import Charts from "./ArchiveCharts";
import LiveTracker from "./LiveTracker";
import { MenuItem, Select, Checkbox } from "@mui/material"

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
    selectArchivedStormPoint
  } = useAppContext();

  const startYear = basin === 'atl' ? 1850 : 1948;
  const years = new Array(2024 - startYear).fill(0);

  const [stormIds, setStormIds] = useState<string[] | null>(null);
  const lastFocusedStormRef = useRef<string | null>(null);

  useEffect(() => {
    if (season) {
      const stormIds = season.map((storm) => {
        return storm.id;
      });
      setStormIds(stormIds);
      lastFocusedStormRef.current = null; // Reset when season changes
    }
  }, [season]);

  // Focus on the selected storm
  useEffect(() => {
    if (season && stormId && !tracker && lastFocusedStormRef.current !== stormId) {
      const selectedStorm = season.find((storm) => storm.id === stormId);
      if (selectedStorm && selectedStorm.data && selectedStorm.data.length > 0) {
        const firstPoint = selectedStorm.data[0];
        selectArchivedStormPoint(stormId, firstPoint.lat, firstPoint.lng);
        lastFocusedStormRef.current = stormId;
      }
    }
  }, [stormId, season, tracker, selectArchivedStormPoint]);

  return (
    <div className='interface'>
      <div className="drag-handle"/>
      {!tracker && (
        <>
          <div className="selectors">
            <Select className="select" value={basin} onChange={(e) => {setBasin(e.target.value)}}>
              <MenuItem value="atl"><p className="text-black font-bold">Atlantic</p></MenuItem>
              <MenuItem value="pac"><p className="text-black font-bold">Pacific</p></MenuItem>
            </Select>
            <Select className="select" value={year} onChange={(e) => {setYear(Number(e.target.value))}}>
              {years.map((_, index) => {
                const selectedYear = 2024 - index;
                return (<MenuItem key={index} value={selectedYear}><p className="text-black font-bold">{selectedYear}</p></MenuItem>);
              })}
            </Select>
            <Select className="select" value={stormId} onChange={(e) => {setStormId(e.target.value)}}>
              {stormIds?.map((id) => {
                const name = id.split('_')[1]
                return (<MenuItem key={id} value={id}><p className="text-black font-bold">{name}</p></MenuItem>);
              })}
            </Select>
          </div>
          {year >= 2004 && (
            <div className="flex items-center gap-1">
              <Checkbox className="!text-white !p-0" onChange={(e) => {setWindField(e.target.checked)}}/>
              <h1 className="text-white font-bold">Wind Field</h1>
            </div>
          )}
          <SeasonArchive/>
          <StormArchive/>
        </>
      )}
      {tracker && <LiveTracker />}
      {!tracker && (
        <div className="sm:hidden w-full">
          <Charts/>
        </div>
      )}
    </div>
  );
};

export default Interface;
