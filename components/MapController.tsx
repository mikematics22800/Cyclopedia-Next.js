'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppContext } from '../contexts/AppContext';

const MapController = () => {
  const map = useMap();
  const { clickedPoint } = useAppContext();

  useEffect(() => {
    if (clickedPoint) {
      map.setView([clickedPoint.lat, clickedPoint.lng], 6, {
        animate: true,
        duration: 1.0
      });
    }
  }, [clickedPoint, map]);

  return null;
};

export default MapController;
