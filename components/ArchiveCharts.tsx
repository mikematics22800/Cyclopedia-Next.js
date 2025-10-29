'use client';

import { useState, useEffect } from 'react';
import Intensity from "./Intensity";
import AceTike from "./AceTike";
import SeasonIntensity from "./SeasonIntensity";
import SeasonAceTike from "./SeasonAceTike";

const ArchiveCharts = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandIntensity, setExpandIntensity] = useState(false);
  const [expandAceTike, setExpandAceTike] = useState(false);
  const [expandSeasonIntensity, setExpandSeasonIntensity] = useState(false);
  const [expandSeasonAceTike, setExpandSeasonAceTike] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
  }, []);

  const toggleChart = (chart: string) => {
    if (!isMobile) {
      return;
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
        <Intensity expanded={expandIntensity} onClick={() => toggleChart('intensity')}/>
        <AceTike expanded={expandAceTike} onClick={() => toggleChart('aceTike')}/>
        <SeasonIntensity expanded={expandSeasonIntensity} onClick={() => toggleChart('seasonIntensity')}/>
        <SeasonAceTike expanded={expandSeasonAceTike} onClick={() => toggleChart('seasonAceTike')}/>
      </div>
    </div>
  );
};

export default ArchiveCharts;
