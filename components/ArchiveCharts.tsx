'use client';

import { useState, ReactNode } from 'react';
import Intensity from "./Intensity";
import AceTike from "./AceTike";
import WindsAndPressures from "./SeasonIntensity";
import SeasonAceTike from "./SeasonAceTike";

const ArchiveCharts = () => {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const handleChartTap = (chartName: string) => {
    if (expandedChart === chartName) {
      setExpandedChart(null);
    } else {
      setExpandedChart(chartName);
    }
  };

  const ChartWrapper = ({ children, chartName }: { children: ReactNode; chartName: string }) => (
    <div 
      className={`chart-wrapper ${expandedChart === chartName ? 'expanded' : ''}`}
      onClick={() => handleChartTap(chartName)}
    >
      {children}
    </div>
  );

  return (
    <div className="charts-container">
      <div className="charts">
        <ChartWrapper chartName="intensity">
          <Intensity/>
        </ChartWrapper>
        <ChartWrapper chartName="acetike">
          <AceTike/>
        </ChartWrapper>
        <ChartWrapper chartName="windsandpressures">
          <WindsAndPressures/>
        </ChartWrapper>
        <ChartWrapper chartName="seasonacetike">
          <SeasonAceTike/>
        </ChartWrapper>
      </div>
    </div>
  );
};

export default ArchiveCharts;
