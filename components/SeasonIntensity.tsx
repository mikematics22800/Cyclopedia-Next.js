'use client';

import { useState, useEffect } from "react";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2';
import { useAppContext } from '../contexts/AppContext';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const SeasonIntensity = ({toggleChart, expanded}: {toggleChart: () => void, expanded: boolean}) => {
  const { names, maxWinds, season } = useAppContext();
  const [minPressures, setMinPressures] = useState<number[]>([]);
  const [key, setKey] = useState(0)

  const onClick = () => {
    if (window.innerWidth >= 480) {
      return
    } 
    {!expanded && setKey(prev => prev + 1)}
    toggleChart()
  };

  useEffect(() => {
    if (!season) return;
    
    const minPressures = season.map((storm) => {
      const pressures = storm.data
        .map((point) => point.min_pressure_mb)
        .filter((pressure): pressure is number => pressure !== undefined && pressure > 0);
      return pressures.length > 0 ? Math.min(...pressures) : 0;
    });
    setMinPressures(minPressures);
  }, [season]);

  if (!season) return null;

  const data = {
    labels: names,
    datasets: [
      {
        label: 'Maximum Wind (kt)',
        data: maxWinds,
        borderColor: "red",
        backgroundColor: "red",
        yAxisID: 'y'
      },
      {
        label: 'Minimum Pressure (mb)',
        data: minPressures,
        borderColor: "blue",
        backgroundColor: "blue",
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white"
        }
      },
      tooltip: {
        bodyColor: "white", 
        titleColor: "white",
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('Pressure')) {
              return `${label}: ${value} mb`;
            } else {
              return `${label}: ${value} kt`;
            }
          }
        }
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: "white"
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: "white"
        },
        min: 860,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          color: "white"
        },
      },
    }
  };

  return (
    <div className={expanded ? "chart-expanded-wrapper" : "chart-wrapper"}>
      <div className={expanded ? "chart-expanded" : "chart"}>
        <Bar key={key} options={options} data={data} onClick={onClick}/>
      </div>
    </div>
  );
};

export default SeasonIntensity;
