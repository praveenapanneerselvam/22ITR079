const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let window = [];

const API_ENDPOINTS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand"
};

app.get("/numbers/:numberid", async (req, res) => {
  const numberId = req.params.numberid;
  const url = API_ENDPOINTS[numberId];

  if (!url) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const windowPrevState = [...window];
  let fetchedNumbers = [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 500);

  try {
    const response = await axios.get(url, { signal: controller.signal });
    fetchedNumbers = response.data.numbers;
  } catch (error) {
    return res.json({
      windowPrevState,
      windowCurrState: window,
      numbers: [],
      avg: average(window)
    });
  } finally {
    clearTimeout(timeout);
  }

  // Add new unique numbers while preserving window size
  for (const num of fetchedNumbers) {
    if (!window.includes(num)) {
      window.push(num);
      if (window.length > WINDOW_SIZE) window.shift();
    }
  }

  res.json({
    windowPrevState,
    windowCurrState: window,
    numbers: fetchedNumbers,
    avg: average(window)
  });
});

function average(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, n) => acc + n, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
