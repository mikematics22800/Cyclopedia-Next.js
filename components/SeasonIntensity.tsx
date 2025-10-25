'use client';

import { useAppContext } from '../contexts/AppContext';

const SeasonIntensity = () => {
  const { season, year } = useAppContext();

  if (!season) return null;

  return (
    <div className="chart">
      <h2 className="text-white text-lg font-bold mb-4">Season Intensity Chart</h2>
      <p className="text-white">Season data for {year}</p>
    </div>
  );
};

export default SeasonIntensity;
