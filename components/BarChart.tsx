'use client';

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: any;
  options: any;
}

const BarChart = ({ data, options }: BarChartProps) => {
  return (
    <Bar data={data} options={options} />
  );
};

export default BarChart;
