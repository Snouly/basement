const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// тестовый роут
app.get('/', (req, res) => {
  res.send('Backend работает');
});

app.get('/devices', async (req, res) => {
  const devices = await prisma.device.findMany();
  res.json(devices);
});

app.listen(3001, () => {
  console.log('Гнусный сервер запущен на http://localhost:3001');
});