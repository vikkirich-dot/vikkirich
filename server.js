const express = require('express');
const axios = require('axios');
const app = express();

// URL твоего Google Apps Script
const GAS_TARGET_URL = 'https://script.google.com/macros/s/AKfycbxXEALX2tK19Q8Ct9-c1hVDoaulLJYb83tEBuu2nV-ZmEb9AxXIB4diro32eJjzlV4odQ/exec';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/gas', async (req, res) => {
  const data = new URLSearchParams();
  for (const [key, value] of Object.entries(req.body)) {
    if (value !== undefined && value !== null) {
      data.append(key, value);
    }
  }

  try {
    const response = await axios.post(GAS_TARGET_URL, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Node.js прокси работает!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
