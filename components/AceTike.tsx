'use client';

import { useAppContext } from '../contexts/AppContext';

const AceTike = () => {
  const { storm, ACE, TIKE } = useAppContext();

  if (!storm) return null;

  return (
    <div className="chart">
      <h2 className="text-white text-lg font-bold mb-4">ACE/TIKE Chart</h2>
      <p className="text-white">ACE: {ACE.toFixed(1)}, TIKE: {TIKE.toFixed(1)} TJ</p>
    </div>
  );
};

export default AceTike;
