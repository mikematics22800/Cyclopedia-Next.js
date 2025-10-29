'use client';

import { useState } from 'react';
import Intensity from "./Intensity";
import AceTike from "./AceTike";
import SeasonIntensity from "./SeasonIntensity";
import SeasonAceTike from "./SeasonAceTike";

const ArchiveCharts = () => {
  const [expandIntensity, setExpandIntensity] = useState(false);
  const [expandAceTike, setExpandAceTike] = useState(false);
  const [expandSeasonIntensity, setExpandSeasonIntensity] = useState(false);
  const [expandSeasonAceTike, setExpandSeasonAceTike] = useState(false);

  const toggleChart = (chart: string) => {
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
        <Intensity expanded={expandIntensity} toggleChart={() => toggleChart('intensity')}/>
        <AceTike expanded={expandAceTike} toggleChart={() => toggleChart('aceTike')}/>
        <SeasonIntensity expanded={expandSeasonIntensity} toggleChart={() => toggleChart('seasonIntensity')}/>
        <SeasonAceTike expanded={expandSeasonAceTike} toggleChart={() => toggleChart('seasonAceTike')}/>
      </div>
    </div>
  );
};

export default ArchiveCharts;
