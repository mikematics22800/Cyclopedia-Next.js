'use client';

import { useAppContext } from '../contexts/AppContext';

const WindField = () => {
  const { storm, windField } = useAppContext();

  if (!windField || !storm) return null;

  return (
    <div>
      {/* Wind field will be rendered here */}
      <p className="text-white">Wind field component</p>
    </div>
  );
};

export default WindField;
