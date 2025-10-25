'use client';

import { useAppContext } from '../contexts/AppContext';

const AreasOfInterest = () => {
  const { areasOfInterest } = useAppContext();

  if (!areasOfInterest || areasOfInterest.length === 0) return null;

  return (
    <div>
      {/* Areas of interest will be rendered here */}
    </div>
  );
};

export default AreasOfInterest;
