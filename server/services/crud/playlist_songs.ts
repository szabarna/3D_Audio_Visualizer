import pool from "../pool.js";

// Create
const addSongToPlaylist = async (playlistId: string, songId: string) => {
  const result = await pool.query(
    "INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING *",
    [playlistId, songId]
  );
  return result.rows[0];
};

// Read
const getPlaylistSongs = async (playlistId: string) => {
  const result = await pool.query(
    "SELECT * FROM playlist_songs WHERE playlist_id = $1",
    [playlistId]
  );
  return result.rows;
};

// NO NEED?
const updatePlaylistSong = async (
  id: string,
  newPlaylistId: string,
  newSongId: string
) => {
  const result = await pool.query(
    "UPDATE playlist_songs SET playlist_id = $1, song_id = $2 WHERE id = $3 RETURNING *",
    [newPlaylistId, newSongId, id]
  );
  return result.rows[0];
};

// Delete
const removeSongFromPlaylist = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM playlist_songs WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
