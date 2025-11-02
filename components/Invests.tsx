import React, { useMemo } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { GeoJSONFeature } from "../libs/hurdat";

interface InvestProperties {
  prob2day: string;
  prob7day: string;
  basin: string;
}

interface PointData {
  id: number;
  point: [number, number];
  color: string;
  prob2day: string;
  prob7day: string;
  basin: string;
  isInside: boolean;
}

interface Connection {
  from: [number, number];
  to: [number, number];
  color: string;
}

type LatLng = [number, number];
type Polygon = LatLng[];

const Invests = (): React.ReactElement | null => {
  const { invests, investAreas } = useAppContext();

  // Check if data exists
  if (!invests || invests.length === 0) {
    return null;
  }

  // Function to determine color based on probability
  const getColorByProbability = (prob2day: string, prob7day: string): string => {
    const maxProb = Math.max(
      parseInt(prob2day.replace('%', '') || '0', 10),
      parseInt(prob7day.replace('%', '') || '0', 10)
    );

    if (maxProb >= 70) {
      return '#ff0000'; // Red for high probability
    } else if (maxProb >= 40) {
      return '#ffa500'; // Orange for medium probability
    } else {
      return '#ffff00'; // Yellow for low probability
    }
  };

  // Ray casting algorithm for point-in-polygon test
  const pointInPolygon = (point: LatLng, polygon: Polygon): boolean => {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  };

  // Function to check if a point is inside any area of interest
  const isPointInsideArea = (point: [number, number], areas: GeoJSONFeature[] | undefined): boolean => {
    if (!areas || areas.length === 0) return false;
    
    return areas.some(area => {
      try {
        // Simple point-in-polygon check using ray casting algorithm
        const coordinates = area.geometry.coordinates[0] as [number, number][];
        const polygon: Polygon = coordinates.map(coord => [coord[1], coord[0]]); // Convert to [lat, lng]
        
        return pointInPolygon([point[1], point[0]], polygon);
      } catch (error) {
        console.error('Error checking point in polygon:', error);
        return false;
      }
    });
  };

  // Memoize the points and connections to avoid unnecessary recalculations
  const pointsAndConnections = useMemo(() => {
    const points: PointData[] = [];
    const connections: Connection[] = [];

    // Filter out points with 0% probabilities
    const filteredPoints = invests.filter((feature: GeoJSONFeature) => {
      const properties = feature.properties as InvestProperties;
      const { prob2day, prob7day } = properties;
      const prob2dayNum = parseInt(prob2day.replace('%', '') || '0', 10);
      const prob7dayNum = parseInt(prob7day.replace('%', '') || '0', 10);
      return prob2dayNum > 0 || prob7dayNum > 0;
    });

    filteredPoints.forEach((feature: GeoJSONFeature, index: number) => {
      const properties = feature.properties as InvestProperties;
      const { prob2day, prob7day, basin } = properties;
      const coordinates = feature.geometry.coordinates as [number, number]; // [lng, lat]
      const point: [number, number] = [coordinates[1], coordinates[0]]; // Convert to [lat, lng] for Leaflet
      
      const color = getColorByProbability(prob2day, prob7day);
      const isInside = isPointInsideArea(coordinates, investAreas);
      
      points.push({
        id: index,
        point,
        color,
        prob2day,
        prob7day,
        basin,
        isInside
      });

      // If point is not inside any area, create a connection line to the nearest area
      if (!isInside && investAreas && investAreas.length > 0) {
        // Find the nearest area center
        let nearestArea: [number, number] | null = null;
        let minDistance = Infinity;
        
        investAreas.forEach((area: GeoJSONFeature) => {
          try {
            const areaCoords = area.geometry.coordinates[0] as [number, number][];
            const areaCenter: [number, number] = [
              areaCoords.reduce((sum, coord) => sum + coord[1], 0) / areaCoords.length,
              areaCoords.reduce((sum, coord) => sum + coord[0], 0) / areaCoords.length
            ];
            
            const distance = Math.sqrt(
              Math.pow(areaCenter[0] - coordinates[1], 2) + 
              Math.pow(areaCenter[1] - coordinates[0], 2)
            );
            
            if (distance < minDistance) {
              minDistance = distance;
              nearestArea = areaCenter;
            }
          } catch (error) {
            console.error('Error calculating area center:', error);
          }
        });

        if (nearestArea) {
          connections.push({
            from: point,
            to: [nearestArea[0], nearestArea[1]],
            color: color
          });
        }
      }
    });

    return { points, connections };
  }, [invests, investAreas]);

  return (
    <>
      {/* Render connection lines */}
      {pointsAndConnections.connections.map((connection, index) => (
        <Polyline
          key={`connection-${index}`}
          positions={[connection.from, connection.to]}
          color={connection.color}
          weight={2}
          opacity={0.6}
          dashArray="5, 5"
        />
      ))}
      
      {/* Render points of interest */}
      {pointsAndConnections.points.map((pointData) => {
        // Create custom X icon
        const xIcon = L.divIcon({
          html: `
            <div style="
              width: 25px; 
              height: 25px; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-size: 25px;
              font-weight: bold;
              color: ${pointData.color};
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            ">
              ✕
            </div>
          `,
          className: 'custom-x-icon',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        return (
          <Marker
            key={`point-${pointData.id}`}
            position={pointData.point}
            icon={xIcon}
          >
            <Popup className="w-fit font-bold">
              <h1 className="text-[1rem] font-bold">Potential Development</h1>
              <p className="!my-1">2-Day Probability: {pointData.prob2day}</p>
              <p className="!my-1">7-Day Probability: {pointData.prob7day}</p>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default Invests;
