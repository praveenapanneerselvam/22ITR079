import express from "express";
import axios from "axios";

const app = express();
const port = 9876;
const windowSize = 10;
let windowNumbers = [];

const baseURLs = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDI3NDIxLCJpYXQiOjE3NDcwMjcxMjEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjUyMjQzZjA5LTNiNzktNGJiYS1iMjllLWM4ODU2ZTgxYzc0NCIsInN1YiI6InByYXZlZW5hcC4yMml0QGtvbmd1LmVkdSJ9LCJlbWFpbCI6InByYXZlZW5hcC4yMml0QGtvbmd1LmVkdSIsIm5hbWUiOiJwcmF2ZWVuYSBwIiwicm9sbE5vIjoiMjJpdHIwNzkiLCJhY2Nlc3NDb2RlIjoiam1wWmFGIiwiY2xpZW50SUQiOiI1MjI0M2YwOS0zYjc5LTRiYmEtYjI5ZS1jODg1NmU4MWM3NDQiLCJjbGllZW50U2VjcmV0IjoiZ1h5eU5DWVFCWkZYdXZhQiJ9.4owk9Yq8nPt1BnHnTuTcFmYxZH8yNoFLtyM2uCw2AI0";

// 🆕 Home route
app.get("/", (req, res) => {
  res.send("Welcome to the Average Calculator Microservice!");
});

app.get("/numbers/:numberid", async (req, res) => {
  const id = req.params.numberid;
  const url = baseURLs[id];

  if (!url) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const windowPrevState = [...windowNumbers];
  let fetched = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`  // Use the correct authorization
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    fetched = response.data.numbers || [];
  } catch (err) {
    console.error("Error fetching data:", err);
    fetched = [];
  }

  for (let num of fetched) {
    if (!windowNumbers.includes(num)) {
      windowNumbers.push(num);
      if (windowNumbers.length > windowSize) {
        windowNumbers.shift();
      }
    }
  }

  const avg =
    windowNumbers.length > 0
      ? (windowNumbers.reduce((a, b) => a + b, 0) / windowNumbers.length).toFixed(2)
      : 0;

  res.json({
    windowPrevState,
    windowCurrState: windowNumbers,
    numbers: fetched,
    avg: parseFloat(avg),
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
