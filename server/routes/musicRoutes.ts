import express from 'express';
import pool from '../services/pool';
import { createPlaylist, deletePlaylist, getPlaylistById, updatePlaylist } from '../services/crud/playlists';
import { createSong, deleteSong, getSongById, updateSong } from '../services/crud/songs';

const router = express.Router();

router.use(express.json())

// PLAYLISTS CRUD

router.post('/playlists/create', async (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ message: 'Name and user ID are required.' });
  }

  try {
    const result = await createPlaylist(name, userId);
    const newPlaylist = result.rows[0];
    res.status(201).json(newPlaylist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

router.get('/playlists/read/:id', async (req, res) => {
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

router.put('/playlists/update/:id', async (req, res) => {
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

router.delete('/playlists/delete/:id', async (req, res) => {
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

// SONGS CRUD

router.post('/songs/create', async (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ message: 'Name and user ID are required.' });
  }

  try {
    const result = await createPlaylist(name, userId);
    const newPlaylist = result.rows[0];
    res.status(201).json(newPlaylist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

router.get('/songs/read/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID is required.' });
  }

  try {
    const playlist = await getSongById(id);
    res.status(200).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/songs/update/:id', async (req, res) => {
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

router.delete('/songs/delete/:id', async (req, res) => {
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
