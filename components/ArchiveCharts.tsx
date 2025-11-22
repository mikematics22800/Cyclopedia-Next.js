'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
const Intensity = dynamic(() => import("./Intensity"), { ssr: false });
const AceTike = dynamic(() => import("./AceTike"), { ssr: false });
const SeasonIntensity = dynamic(() => import("./SeasonIntensity"), { ssr: false });
const SeasonAceTike = dynamic(() => import("./SeasonAceTike"), { ssr: false });

const ArchiveCharts = ({stormId}: {stormId: string}) => {
  const [expandIntensity, setExpandIntensity] = useState(false);
  const [expandAceTike, setExpandAceTike] = useState(false);
  const [expandSeasonIntensity, setExpandSeasonIntensity] = useState(false);
  const [expandSeasonAceTike, setExpandSeasonAceTike] = useState(false);

  const toggleExpand = (chart: string) => {
    if (window.innerWidth >= 480) {
      return
    } 
    if (chart === 'intensity') {
      setExpandIntensity(!expandIntensity);
    } else if (chart === 'aceTike') {
      setExpandAceTike(!expandAceTike);
    } else if (chart === 'seasonIntensity') {
      setExpandSeasonIntensity(!expandSeasonIntensity);
    } else if (chart === 'seasonAceTike') {
      setExpandSeasonAceTike(!expandSeasonAceTike);
    }
  }

  return (
    <div className="charts-container">
      <div className="charts">
        {stormId==='season' ? 
          <>        
            <SeasonIntensity onClick={() => toggleExpand('seasonIntensity')} expand={expandSeasonIntensity}/>
            <SeasonAceTike onClick={() => toggleExpand('seasonAceTike')} expand={expandSeasonAceTike}/>
          </>  
        :
          <>
            <Intensity onClick={() => toggleExpand('intensity')} expand={expandIntensity}/>
            <AceTike onClick={() => toggleExpand('aceTike')} expand={expandAceTike}/>
          </>
        }
        </div>
    </div>
  );
};

export default ArchiveCharts;
