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

app.patch('/devices/:id/toggle', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Некорректный id устройства' });
  }

  try {
    const device = await prisma.device.findUnique({
      where: { id }
    });

    if (!device) {
      return res.status(404).json({ message: 'Устройство не найдено' });
    }

    const updatedDevice = await prisma.device.update({
      where: { id },
      data: {
        isOn: !device.isOn
      }
    });

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось изменить состояние устройства' });
  }
});

app.delete('/devices/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Некорректный id устройства' });
  }

  try {
    await prisma.device.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Устройство не найдено' });
  }
});

app.listen(3001, () => {
  console.log('Гнусный сервер запущен на http://localhost:3001');
});
