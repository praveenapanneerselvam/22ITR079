import { useState, useEffect } from 'react';
import { getStockPriceHistory } from '../api/api';
import { Line } from 'react-chartjs-2';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const StockPage = () => {
  const [stockData, setStockData] = useState([]);
  const [timeFrame, setTimeFrame] = useState(50);

  useEffect(() => {
    const fetch = async () => {
      const data = await getStockPriceHistory('NVDA', timeFrame);
      setStockData(data);
    };
    fetch();
  }, [timeFrame]);

  const chartData = {
    labels: stockData.map((d) => new Date(d.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Price',
        data: stockData.map((d) => d.price),
        borderColor: '#1976d2',
        fill: false,
      },
    ],
  };

  return (
    <Box p={3}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Time Frame</InputLabel>
        <Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)} label="Time Frame">
          <MenuItem value={10}>Last 10 mins</MenuItem>
          <MenuItem value={30}>Last 30 mins</MenuItem>
          <MenuItem value={50}>Last 50 mins</MenuItem>
        </Select>
      </FormControl>

      <Line data={chartData} />
    </Box>
  );
};

export default StockPage;
