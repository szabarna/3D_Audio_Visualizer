import pool from "../pool";

// Create
const createPlaylist = async (name: string, userId: string, description: string, imageBuffer: Buffer) => {
  const result = await pool.query(
    "INSERT INTO playlists (name, user_id, description, img) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, userId, description, imageBuffer]
  );
  return result.rows[0];
};

// Read
const getPlaylistById = async (id: string) => {
  const result = await pool.query("SELECT * FROM playlists WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

// Update
const updatePlaylist = async (id: string, name: string) => {
  const result = await pool.query(
    "UPDATE playlists SET name = $1 WHERE id = $2 RETURNING *",
    [name, id]
  );
  return result.rows[0];
};

// Delete
const deletePlaylist = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM playlists WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

// Get All Playlists and their songs for a specific user
const getPlaylistsByUserId = async (userId: string) => {
  const result = await pool.query(
    `SELECT p.id AS playlist_id, p.name AS playlist_name, s.id AS song_id, s.title AS song_title, s.artist AS song_artist
      FROM playlists p
      LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
      LEFT JOIN songs s ON ps.song_id = s.id
      WHERE p.user_id = $1`,
    [userId]
  );

  const playlists: any = {};

  result.rows.forEach((row) => {
    if (!playlists[row.playlist_id]) {
      playlists[row.playlist_id] = {
        id: row.playlist_id,
        name: row.playlist_name,
        songs: [],
      };
    }

    if (row.song_id) {
      playlists[row.playlist_id].songs.push({
        id: row.song_id,
        title: row.song_title,
        artist: row.song_artist,
      });
    }
  });

  return Object.values(playlists);
};

export {getPlaylistById, getPlaylistsByUserId, createPlaylist, updatePlaylist, deletePlaylist }
