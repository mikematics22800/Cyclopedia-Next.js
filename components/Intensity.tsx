'use client';

import { useAppContext } from '../contexts/AppContext';

const Intensity = () => {
  const { storm, dates } = useAppContext();

  if (!storm) return null;

  return (
    <div className="chart">
      <h2 className="text-white text-lg font-bold mb-4">Intensity Chart</h2>
      <p className="text-white">Intensity data for {storm.id.split('_')[1]}</p>
    </div>
  );
};

export default Intensity;
