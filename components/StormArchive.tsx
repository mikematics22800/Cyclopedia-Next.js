'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import CycloneIcon from '@mui/icons-material/Cyclone';

const StormArchive = () => {
  const { year, storm, stormId, ACE, TIKE } = useAppContext();

  const [stormName, setStormName] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [retired, setRetired] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [maxWind, setMaxWind] = useState<string>('');
  const [minPressure, setMinPressure] = useState<string>('');
  const [landfalls, setLandfalls] = useState<any[]>([]);
  const [inlandMaxWind, setInlandMaxWind] = useState<string>('');
  const [inlandMinPressure, setInlandMinPressure] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [deadOrMissing, setDeadOrMissing] = useState<string>('');

  useEffect(() => {
    if (!storm) return;

    setStormName(storm.id.split('_')[1]);
    setImage(storm.image || '');
    setImageLoading(true);
    setRetired(storm.retired || false);

    const data = storm.data;

    const startArray = data[0].date.toString().split('');
    const startYear = startArray.slice(0,4).join('');
    const startMonth = parseInt(startArray.slice(4,6).join(''));
    const startDay = parseInt(startArray.slice(-2).join(''));
    const startDate = `${startMonth}/${startDay}/${startYear}`;
    const endArray = data[data.length - 1].date.toString().split('');    
    const endYear = endArray.slice(0,4).join('');
    const endMonth = parseInt(endArray.slice(4,6).join(''));
    const endDay = parseInt(endArray.slice(-2).join(''));
    const endDate = `${endMonth}/${endDay}/${endYear}`;
    const duration = `${startDate}-${endDate}`;
    setDuration(duration);

    const winds = data.map((point) => {
      return point.max_wind_kt;
    });
    const maxWind = Math.max(...winds);
    setMaxWind(maxWind.toString());

    const pressures = data.map((point) => {
      if (point.min_pressure_mb && point.min_pressure_mb > 0) {
        return point.min_pressure_mb;
      } else {
        return 9999;
      }
    });

    const minPressure = Math.min(...pressures);
    setMinPressure(minPressure.toString());

    const landfalls = data.filter(point => point.record === "L");
    setLandfalls(landfalls);

    const inlandWinds = landfalls.map((point) => {
      return point.max_wind_kt;
    });
    setInlandMaxWind(Math.max(...inlandWinds).toString());

    const inlandPressures = landfalls.map((point) => {
      if (point.min_pressure_mb && point.min_pressure_mb > 0) {
        return point.min_pressure_mb;
      } else {
        return 9999;
      }
    });
    setInlandMinPressure(Math.min(...inlandPressures).toString());

    setImage(storm.image || '');

    const cost = ((storm.cost_usd || 0)/1000000).toFixed(1);
    setCost(cost);

    const deadOrMissing = storm.dead_or_missing || 0;
    setDeadOrMissing(deadOrMissing.toString());

    let textColor: string = "aqua";
    const statuses = data.map((point) => {
      return point.status;
    });
    if (statuses.includes("HU")) {
      if (maxWind <= 82) {
        textColor = "yellow";
      }
      if (maxWind > 82 && maxWind <= 95) {
        textColor = "orange";
      }
      if (maxWind > 95 && maxWind <= 110) {
        textColor = "red";
      }
      if (maxWind > 110 && maxWind <= 135) {
        textColor = "hotpink";
      }
      if (maxWind > 135) {
        textColor = "pink";
      }
    } else {
      if (statuses.includes("TS")) {
        textColor = "lime";
      } else {
        if (statuses.includes("SS")) {
          textColor = "#D0F0C0";
        } else {
          if (statuses.includes("TD")) {
            textColor = "dodgerblue";
          } else {
            textColor = "aqua";
          }
        }
      }
    }
    setTextColor(textColor);
  }, [storm]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  if (!storm) return null;

  return (
    <div className='storm'>
      <div className='flex flex-col gap-6 w-full items-center'>
        {/* Storm Image Section */}
        <div className='storm-image-container'>
          <a 
            target='_blank' 
            className={`storm-image-link ${retired ? 'retired' : ''} ${year < 1995 ? '!pointer-events-none' : ''}`}
            style={{backgroundImage: `url(${image})`}} 
            href={`https://www.nhc.noaa.gov/data/tcr/${stormId}.pdf`}
          >
            {/* Hidden img element to track loading */}
            {image !== "" && (
              <img 
                src={image} 
                style={{display: 'none'}}
                onLoad={handleImageLoad}
                onError={handleImageError}
                alt=""
              />
            )}
            
            {/* Loading State */}
            {imageLoading && image !== "" && (
              <div className='storm-image-loading'>
                <img src="/cyclone.png" alt="Loading" className="animate-spin h-12 w-12" />
                <h1 className='unavailable-text'>Loading...</h1>
              </div>
            )}
            
            {/* No Image State */}
            {image == "" && (
              <div className='storm-image-unavailable'>
                <CycloneIcon className='cyclone-icon'/>
                <h1 className='unavailable-text'>Image Unavailable</h1>
              </div>
            )}
            
            {/* Retired Badge */}
            {retired && <img className='retired-badge' src="/retired.png"/>}
          </a>
        </div>

        {/* Storm Data Section */}
          <ul className='storm-data bg-gray-800 w-full'>
            {/* Storm Header */}
            <li className='storm-header'>
              <h1 className='storm-title' style={{color:textColor}}>
                {stormName}
              </h1>     
              <h1 className='text-sm font-bold'>
                {duration}
              </h1>     
            </li>
            
            {/* Wind Data */}
            <li className='storm-data-item'>
              <h2 className='storm-label'>Maximum Wind</h2>
              <h2 className='storm-value'>{maxWind} kt</h2>
            </li>
            
            {landfalls.length > 0 && (
              <li className='storm-data-item'>
                <h2 className='storm-label'>Maximum Inland Wind</h2>
                <h2 className='storm-value'>{inlandMaxWind} kt</h2>
              </li>
            )}
            
            {/* Pressure Data */}
            <li className='storm-data-item'>
              <h2 className='storm-label'>Minimum Pressure</h2>
              <h2 className='storm-value'>
                {minPressure != "9999" && minPressure != "-999" ? `${minPressure} mb` : 'Unknown'}
              </h2>
            </li>
            
            {landfalls.length > 0 && (
              <li className='storm-data-item'>
                <h2 className='storm-label'>Minimum Inland Pressure</h2>
                <h2 className='storm-value'>
                  {inlandMinPressure != "9999" && inlandMinPressure != "-999" ? `${inlandMinPressure} mb` : 'Unknown'}
                </h2>
              </li>
            )}
            
            {/* Impact Data */}
            <li className='storm-data-item'>
              <h2 className='storm-label'>Dead/Missing</h2>
              <h2 className='storm-value'>{deadOrMissing}</h2>
            </li>
            
            {/* Cost Data */}
            <li className='storm-data-item'>
              <h2 className='storm-label'>Cost (Million USD)</h2>
              <h2 className='storm-value cost-value'>${cost}</h2>
            </li>

                     
            {/* Energy Data */}
            <li className='storm-data-item'>
              <h2 className='storm-label'>Accumulated Cyclone Energy</h2>
              <h2 className='storm-value'>{ACE.toFixed(1)}</h2>
            </li>
            
            {year >= 2004 && (
              <li className='storm-data-item last'>
                <h2 className='storm-label'>Track Integrated Kinetic Energy</h2>
                <h2 className='storm-value'>{TIKE.toFixed(1)} TJ</h2>
              </li>
            )}
          </ul>
        </div>
    </div>
  );
};

export default StormArchive;
