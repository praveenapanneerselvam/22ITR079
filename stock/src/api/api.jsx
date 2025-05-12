import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';

export const getStocks = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.stocks;
};

export const getStockPriceHistory = async (ticker, minutes) => {
  const res = await axios.get(`${BASE_URL}/${ticker}`, {
    params: { minutes },
  });
  return res.data;
};
