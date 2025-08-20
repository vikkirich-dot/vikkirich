const express = require('express');
const axios = require('axios');
const app = express();

// Замени на URL твоего Google Apps Script
const GAS_TARGET_URL = 'https://script.google.com/macros/s/AKfycbxXEALX2tK19Q8Ct9-c1hVDoaulLJYb83tEBuu2nV-ZmEb9AxXIB4diro32eJjzlV4odQ/exec';

app.use(express.json());
app.use(express.static('public')); // если у тебя HTML в папке public

// Главный маршрут для админки
app.post('/api/gas', async (req, res) => {
  const { action, id, name, price, description, article, images, specs } = req.body;

  const data = new URLSearchParams();
  data.append('action', action);
  if (id) data.append('id', id);
  if (name) data.append('name', name);
  if (price) data.append('price', price);
  if (description) data.append('description', description);
  if (article) data.append('article', article);
  if (images) data.append('images', Array.isArray(images) ? images.join(',') : images);
  if (specs) data.append('specs', typeof specs === 'string' ? specs : JSON.stringify(specs));

  try {
    const response = await axios.post(GAS_TARGET_URL, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при запросе к GAS:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Теперь в HTML используй: const GAS_URL = "http://localhost:3000/api/gas";');
});