'use client';

import { useAppContext } from '../contexts/AppContext';

const SeasonAceTike = () => {
  const { season, seasonACE, year } = useAppContext();

  if (!season) return null;

  return (
    <div className="chart">
      <h2 className="text-white text-lg font-bold mb-4">Season ACE/TIKE Chart</h2>
      <p className="text-white">Season ACE data for {year}</p>
    </div>
  );
};

export default SeasonAceTike;
