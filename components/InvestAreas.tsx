import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { Polygon, Popup } from "react-leaflet";
import { GeoJSONFeature } from "../libs/hurdat";

interface InvestProperties {
  prob2day: string;
  prob7day: string;
  basin: string;
}

interface PolygonStyle {
  fillColor: string;
  color: string;
  fillOpacity: number;
  weight: number;
}

const InvestAreas = (): React.ReactElement | null => {
  const { investAreas } = useAppContext();

  const getColorByProbability = (prob2day: string, prob7day: string): PolygonStyle => {
    // Use the higher probability between 2-day and 7-day
    const maxProb = Math.max(
      parseInt(prob2day.replace('%', '') || '0', 10),
      parseInt(prob7day.replace('%', '') || '0', 10)
    );

    if (maxProb >= 70) {
      return {
        fillColor: 'red',
        color: 'red',
        fillOpacity: 0.3,
        weight: 2
      };
    } else if (maxProb >= 40 && maxProb <= 60) {
      return {
        fillColor: 'orange',
        color: 'orange',
        fillOpacity: 0.3,
        weight: 2
      };
    } else if (maxProb >= 0 && maxProb <= 30) {
      return {
        fillColor: 'yellow',
        color: 'yellow',
        fillOpacity: 0.3,
        weight: 2
      };
    } else {
      // Default for any other values
      return {
        fillColor: 'gray',
        color: 'gray',
        fillOpacity: 0.3,
        weight: 2
      };
    }
  };

  // Check if data exists
  if (!investAreas || investAreas.length === 0) {
    return null;
  }

  return (
    <>
      {investAreas.map((feature: GeoJSONFeature, index: number) => {
        const properties = feature.properties as InvestProperties;
        const { prob2day, prob7day, basin } = properties;
        const style = getColorByProbability(prob2day, prob7day);

        // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
        const coordinates = (feature.geometry.coordinates[0] as [number, number][]).map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);

        return (
          <Polygon
            key={`area-${index}`}
            positions={coordinates}
            fillColor={style.fillColor}
            color={style.color}
            fillOpacity={style.fillOpacity}
            weight={style.weight}
          >
            <Popup className="w-fit font-bold">
              <h1 className="text-[1rem] font-bold">Potential Development</h1>
              <p className="!my-1">2-Day Probability: {prob2day}</p>
              <p className="!my-1">7-Day Probability: {prob7day}</p>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
};

export default InvestAreas;