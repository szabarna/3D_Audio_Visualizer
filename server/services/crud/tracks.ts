import pool from "../pool";

// Create
const createTrack = async (title: string, artist: string, audio: Buffer, img: Buffer) => {
  const result = await pool.query(
    "INSERT INTO tracks (title, artist, audio, img) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, artist, audio, img]
  );
  return result.rows[0];
};

const getAllTrack = async () => {
  const result = await pool.query(
    "SELECT id, title, artist, img, type_id FROM tracks",
  );
  return {
    "items": result.rows,
    "count": result.rowCount
  }; 
};

// Read
const getTrackById = async (id: string) => {
  const result = await pool.query("SELECT * FROM tracks WHERE id = $1", [id]);
  return result.rows[0];
};

// Update
const updateSong = async (id: string, title: string, artist: string) => {
  const result = await pool.query(
    "UPDATE tracks SET title = $1, artist = $2 WHERE id = $3 RETURNING *",
    [title, artist, id]
  );
  return result.rows[0];
};

// Delete
const deleteSong = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM tracks WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export { deleteSong, createTrack, updateSong, getTrackById, getAllTrack }