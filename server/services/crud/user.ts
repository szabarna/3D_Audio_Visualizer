import pool from '../pool';

// Create
const createUser = async (username: string, email: string) => {
    const result = await pool.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );
    return result.rows[0];
  };
  
  // Read
  const getUserById = async (id: string) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  };
  
  // Update
  const updateUser = async (id: string, username: string, email: string) => {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, id]
    );
    return result.rows[0];
  };
  
  // Delete
  const deleteUser = async (id: string) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  };
  
