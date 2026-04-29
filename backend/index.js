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
  const { location } = req.query;

  try {
    const devices = await prisma.device.findMany({
      where: location ? { location: String(location) } : undefined,
      orderBy: {
        id: 'asc',
      },
    });

    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось загрузить устройства' });
  }
});

app.post('/devices', async (req, res) => {
  const { name, type, location } = req.body;
  const deviceName = name ? String(name).trim() : '';

  if (!deviceName || !type) {
    return res.status(400).json({ message: 'name и type обязательны' });
  }

  try {
    const device = await prisma.device.create({
      data: {
        name: deviceName,
        type: String(type),
        location: location ? String(location) : 'home'
      }
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось добавить устройство' });
  }
});

app.listen(3001, () => {
  console.log('Гнусный сервер запущен на http://localhost:3001');
});
