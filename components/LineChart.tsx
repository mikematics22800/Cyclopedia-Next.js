'use client';

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface LineChartProps {
  data: any;
  options: any;
}

const LineChart = ({ data, options }: LineChartProps) => {
  return (
    <Line data={data} options={options} />
  );
};

export default LineChart;
