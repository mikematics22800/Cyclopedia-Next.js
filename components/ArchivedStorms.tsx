'use client';

import { useAppContext } from '../contexts/AppContext';

const ArchivedStorms = () => {
  const { season, selectArchivedStormPoint } = useAppContext();

  if (!season) return null;

  return (
    <div>
      {/* Archived storms will be rendered here */}
      <p className="text-white">Archived storms component</p>
    </div>
  );
};

export default ArchivedStorms;
