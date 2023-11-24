import pool from "../pool.js";

// Create
const createTrack = async (title: string, artist: string, type_id:number, audio: Buffer, img: Buffer) => {
  const result = await pool.query(
    "INSERT INTO tracks (title, artist, type_id, audio, img) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, artist, type_id, audio, img]
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
const updateTrack = async (id: string, title: string, artist: string) => {
  const result = await pool.query(
    "UPDATE tracks SET title = $1, artist = $2 WHERE id = $3 RETURNING *",
    [title, artist, id]
  );
  return result.rows[0];
};

// Delete
const deleteTrack = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM tracks WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const getAllTrackType = async () => {
  const result = await pool.query(
    "SELECT * FROM track_type",
  );
  return {
    "items": result.rows,
    "count": result.rowCount
  }; 
};

export { deleteTrack, createTrack, updateTrack, getTrackById, getAllTrack, getAllTrackType }