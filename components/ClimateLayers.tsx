'use client';

import { useState, Dispatch, SetStateAction } from "react";
import { Checkbox, FormGroup, FormControlLabel, Tooltip, IconButton } from "@mui/material";
import { Close, Settings } from "@mui/icons-material";

interface Layers {
  clouds: boolean;
  precip: boolean;
  wind: boolean;
  pressure: boolean;
  temp: boolean;
}

const ClimateLayers = ({ layers, setLayers }: { layers: Layers, setLayers: Dispatch<SetStateAction<Layers>> }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (layer: string, value: boolean) => {
    switch(layer) {
      case 'clouds':
        setLayers(prev => ({ ...prev, clouds: value }));
        break;
      case 'precip':
        setLayers(prev => ({ ...prev, precip: value }));
        break;
      case 'wind':
        setLayers(prev => ({ ...prev, wind: value }));
        break;
      case 'pressure':
        setLayers(prev => ({ ...prev, pressure: value }));
        break;
      case 'temp':
        setLayers(prev => ({ ...prev, temp: value }));
        break;
    }
  };

  return (
    <>
      {open ? (
        <div className="flex flex-col gap-2 font-bold text-white bg-black bg-opacity-50 rounded-lg w-fit p-2 cursor-pointer">
          <Tooltip title="Climate Layers" placement="bottom" arrow>
            <IconButton 
              onClick={() => setOpen(false)}
              sx={{ 
                padding: 0,
                '&:hover': { 
                  backgroundColor: 'transparent',
                  boxShadow: 'none'
                }
              }}
            >
              <Settings className="!text-2xl text-white"/>
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <div className="bg-black/50 rounded-lg p-4">
          <FormGroup className="text-white">
            <div className="flex justify-between items-center">
              <FormControlLabel 
                control={<Checkbox className="!text-white" checked={layers.clouds} onChange={(e) => handleChange('clouds', e.target.checked)}/>} 
                label="Clouds" 
              />
              <IconButton onClick={() => setOpen(true)}>
                <Close className="text-white"/>
              </IconButton>
            </div>
            <FormControlLabel 
              control={<Checkbox className="!text-white" checked={layers.precip} onChange={(e) => handleChange('precip', e.target.checked)}/>} 
              label="Precipitation" 
            />
            <FormControlLabel 
              control={<Checkbox className="!text-white" checked={layers.wind} onChange={(e) => handleChange('wind', e.target.checked)}/>} 
              label="Wind" 
            />
            <FormControlLabel 
              control={<Checkbox className="!text-white" checked={layers.pressure} onChange={(e) => handleChange('pressure', e.target.checked)}/>} 
              label="Sea Level Pressure" 
            />
            <FormControlLabel 
              control={<Checkbox className="!text-white" checked={layers.temp} onChange={(e) => handleChange('temp', e.target.checked)}/>} 
              label="Temperature" 
            />
          </FormGroup>
        </div>
      )}
    </>
  );
};

export default ClimateLayers;
