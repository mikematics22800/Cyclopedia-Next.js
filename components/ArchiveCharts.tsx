'use client';

import { useState, ReactNode, useEffect } from 'react';
import Intensity from "./Intensity";
import AceTike from "./AceTike";
import WindsAndPressures from "./SeasonIntensity";
import SeasonAceTike from "./SeasonAceTike";

const ArchiveCharts = () => {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleChartTap = (chartName: string) => {
    // Only allow chart expansion on mobile devices
    if (!isMobile) return;
    
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
