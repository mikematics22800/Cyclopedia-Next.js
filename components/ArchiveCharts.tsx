'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
const Intensity = dynamic(() => import("./Intensity"));
const AceTike = dynamic(() => import("./AceTike"));
const SeasonIntensity = dynamic(() => import("./SeasonIntensity"));
const SeasonAceTike = dynamic(() => import("./SeasonAceTike"));

const ArchiveCharts = () => {
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
        <Intensity onClick={() => toggleExpand('intensity')} expand={expandIntensity}/>
        <AceTike onClick={() => toggleExpand('aceTike')} expand={expandAceTike}/>
        <SeasonIntensity onClick={() => toggleExpand('seasonIntensity')} expand={expandSeasonIntensity}/>
        <SeasonAceTike onClick={() => toggleExpand('seasonAceTike')} expand={expandSeasonAceTike}/>
      </div>
    </div>
  );
};

export default ArchiveCharts;
