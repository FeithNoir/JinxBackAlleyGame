const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Endpoint to get the most recent game state
app.get('/api/game/latest', async (req, res) => {
  try {
    const latestGameState = await prisma.gameState.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    if (latestGameState) {
      res.json(latestGameState);
    } else {
      res.status(404).json({ message: 'No game state found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game state', error });
  }
});

// Endpoint to save a new game state
app.post('/api/game', async (req, res) => {
  const { state } = req.body;

  if (!state) {
    return res.status(400).json({ message: 'State data is required' });
  }

  try {
    const newGameState = await prisma.gameState.create({
      data: {
        state: state,
      },
    });
    res.status(201).json(newGameState);
  } catch (error) {
    res.status(500).json({ message: 'Error saving game state', error });
  }
});

const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
