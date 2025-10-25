'use client';

import { useAppContext } from '../contexts/AppContext';

const PointsOfInterest = () => {
  const { pointsOfInterest } = useAppContext();

  if (!pointsOfInterest || pointsOfInterest.length === 0) return null;

  return (
    <div>
      {/* Points of interest will be rendered here */}
    </div>
  );
};

export default PointsOfInterest;
