import pool from "../pool";

// Create
const createSong = async (title: string, artist: string, audio: Buffer) => {
  const result = await pool.query(
    "INSERT INTO songs (title, artist, audio) VALUES ($1, $2, $3) RETURNING *",
    [title, artist, audio]
  );
  return result.rows[0];
};

// Read
const getSongById = async (id: string) => {
  const result = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
  return result.rows[0];
};

// Update
const updateSong = async (id: string, title: string, artist: string) => {
  const result = await pool.query(
    "UPDATE songs SET title = $1, artist = $2 WHERE id = $3 RETURNING *",
    [title, artist, id]
  );
  return result.rows[0];
};

// Delete
const deleteSong = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM songs WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export { deleteSong, createSong, updateSong, getSongById }