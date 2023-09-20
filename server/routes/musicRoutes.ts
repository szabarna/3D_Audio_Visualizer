import express from 'express';
import multer from 'multer';
import pool from '../services/pool';
const cors = require('cors');

import { createPlaylist, deletePlaylist, getPlaylistById, updatePlaylist } from '../services/crud/playlists';

const router = express.Router();
// router.use( cors );

router.use(express.json({ limit: "10mb" }))


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// PLAYLISTS CRUD

router.post('/playlist/create', upload.single('file'), async (req, res) => {
  const { name, userId, description } = req.body;

  const imageBuffer = req.file?.buffer;

  if (!name || !userId || !imageBuffer) {
    return res.status(400).json({ message: 'Name, user ID, and image are required.' });
  }

  const client = await pool.connect();

  try {
    const result = await createPlaylist(name, userId, description, imageBuffer );

    console.log(`Playlist created with id: ${result.id}`)

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }

});

router.get('/playlist/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID is required.' });
  }

  try {
    const playlist = await getPlaylistById(id);
    res.status(200).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/playlist/update/:id', async (req, res) => {
  const { id } = req.params;

  if (!id && !req.body) {
    return res.status(400).json({ message: 'ID and Name is required.' });
  }

  try {
    const updatedPlaylist = await updatePlaylist(req.params.id, req.body);
    res.status(200).json(updatedPlaylist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/playlist/delete/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID is required.' });
  }

  try {
    await deletePlaylist(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





export default router;
