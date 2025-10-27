'use client';

import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ArchivedStorms from "./ArchivedStorms";
import LiveStorms from "./LiveStorms";
import WindField from "./WindField";
import Legend from "./Legend";
import ClimateLayers from "./ClimateLayers";
import AreasOfInterest from "./AreasOfInterest";
import PointsOfInterest from "./PointsOfInterest";
import MapController from "./MapController";

interface WeatherLayers {
  clouds: boolean;
  precipitation: boolean;
  wind: boolean;
  pressure: boolean;
  temp: boolean;
}

const Map = () => {
  const { tracker, windField, year } = useAppContext();
  const id = process.env.NEXT_PUBLIC_OWM_KEY;

  const [weatherLayers, setWeatherLayers] = useState<WeatherLayers>({
    clouds: true,
    precipitation: true,
    wind: true,
    pressure: false,
    temp: false
  });

  const handleLayerChange = (layers: WeatherLayers) => {
    setWeatherLayers(layers);
  };

  return (
    <div className="map relative">
      {/* Legend and Weather Controls */}
      <div className="map-controls-container">
        {tracker && <ClimateLayers onLayerChange={handleLayerChange} />}
        <Legend />
      </div>

      <MapContainer 
        className='h-full w-full'
        maxBounds={[[90, 180], [-90, -180]]} 
        center={[30, -60]} 
        maxZoom={15} 
        minZoom={3} 
        zoom={4}
      >
        <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'/>
        
        {/* Weather Layers - Only in live/tracker mode */}
        {tracker && weatherLayers.clouds && <TileLayer url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${id}`} />}
        {tracker && weatherLayers.precipitation && <TileLayer url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${id}`}/>}
        {tracker && weatherLayers.temp && <TileLayer url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${id}`}/>}
        {tracker && weatherLayers.wind && <TileLayer url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${id}`}/>}      
        {tracker && weatherLayers.pressure && <TileLayer url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${id}`}/>}
        
        {/* Storm Layers */}
        {tracker ? <LiveStorms /> : <ArchivedStorms />}
        {year >= 2004 && windField && !tracker && <WindField/>}
        {tracker && <AreasOfInterest />}
        {tracker && <PointsOfInterest />}
        <MapController />
      </MapContainer>
    </div>
  );
};

export default Map;
