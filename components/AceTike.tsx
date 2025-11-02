'use client';

import { useAppContext } from '../contexts/AppContext';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AceTike = ({onClick, expand}: {onClick: () => void, expand: boolean}) => {
  const { dates, ACEArray, TIKEArray, year } = useAppContext();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        labels: {
          color: "white",
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        bodyColor: "white", 
        titleColor: "white",
        borderColor: 'white',
        borderWidth: 1,
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            if (context.dataset.label === 'Accumulated Cyclone Energy') {
              return `Accumulated Cyclone Energy: ${context.parsed.y.toFixed(1)}`;
            } else if (context.dataset.label === 'Track Integrated Kinetic Energy (TJ)') {
              return `Track Integrated Kinetic Energy (TJ): ${context.parsed.y.toFixed(1)} TJ`;
            }
            return context.dataset.label;
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
          color: "white",
          callback: function(value: any) {
            return value.toFixed(1);
          }
        },
      },
      y1: {
        type: 'linear' as const,
        display: year >= 2004,
        position: 'right' as const,
        ticks: {
          color: "white",
          callback: function(value: any) {
            return value.toFixed(0);
          }
        },
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

  const datasets = [
    {
      label: 'Accumulated Cyclone Energy',
      data: ACEArray?.map((ACE) => parseFloat(ACE.toFixed(1))),
      borderColor: "purple",
      backgroundColor: "pink",
      yAxisID: 'y'
    }
  ];

  // Only add TIKE dataset if year >= 2004
  if (year >= 2004) {
    datasets.push({
      label: 'Track Integrated Kinetic Energy (TJ)',
      data: TIKEArray?.map((tike) => parseFloat(tike.toFixed(1))),
      borderColor: "orange",
      backgroundColor: "lightyellow",
      yAxisID: 'y1'
    });
  }

  const data = {
    labels: dates,
    datasets: datasets
  };

  return (
    <div className={expand ? "chart-expand-wrapper" : "chart-wrapper"}>
      <div className={expand ? "chart-expand" : "chart"}>
        <Line options={options} data={data} onClick={onClick} />
      </div>
    </div>
  );
};

export default AceTike;
