import express from 'express';
import multer from 'multer';
import pool from '../services/pool';
const cors = require('cors');

import { createPlaylist, deletePlaylist, getAllPlaylistByUserId, getPlaylistById, updatePlaylist } from '../services/crud/playlists';
import { createTrack, getAllTrack, getTrackById } from '../services/crud/tracks';

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

router.get('/playlists/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'ID is required.' });
  }

  try {
    const playlist = await getAllPlaylistByUserId(userId);
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

// TRACKS CRUD

router.post('/track/create', upload.any(), async (req, res) => {
  const { title, artist } = req.body;
  const files = req.files as Express.Multer.File[];

  const imageBuffer = files[0].buffer;
  const audioBuffer = files[1].buffer;

  if (!title || !artist || !imageBuffer || !audioBuffer) {
    return res.status(400).json({ message: 'Title, Artist, and image and audio are required.' });
  }

  const client = await pool.connect();

  try {
    const result = await createTrack(title, artist, audioBuffer, imageBuffer );

    console.log(`Track created with id: ${result.id}`)

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }

});

 router.get('/track/:id', async (req, res) => {
   const { id } = req.params;

   if (!id) {
     return res.status(400).json({ message: 'ID is required.' });
   }
  
   try {
     const track = await getTrackById(id);
     track.audio = `http://localhost:7007/api/stream/${id}`;
     res.status(200).json(track);
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Internal Server Error' });
   }
 });

router.get('/stream/:id', async (req, res) => {
  const { id } = req.params;
  const range = req.headers.range;

  if (!id) {
    return res.status(400).json({ message: 'ID is required.' });
  }

  try {
    const track = await getTrackById(id);

    if (!track) {
      return res.status(404).send("Track not found");
    }

    const audioData = track.audio; // Assuming 'audio' column has the binary data
    const audioLength = Buffer.from(audioData).length;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : audioLength - 1;

      if (start >= audioLength) {
        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + audioLength);
        return;
      }

      const chunksize = (end - start) + 1;
      const audioChunk = audioData.slice(start, end + 1);

      res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + audioLength,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg' // Assuming it's an MP3. Adjust if necessary.
      });
      res.end(audioChunk);
    } else {
      res.writeHead(200, {
        'Content-Length': audioLength,
        'Content-Type': 'audio/mpeg'
      });
      res.end(audioData);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/tracks', async (_req, res) => {

  const client = await pool.connect();
  try {
    const result = await getAllTrack();

    console.log(`Successfully fetched ${result.count} track.`)

    res.status(201).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});




export default router;
