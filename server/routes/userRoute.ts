import express from 'express';
import pool from '../services/pool.js';
import { createUser } from '../services/crud/user.js';

const router = express.Router();

router.use(express.json({ limit: "10mb" }));

router.post('/user/create', async (req, res) => {
    const { name, email } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ message: 'Name, Email are required.' });
    }
    
    console.log(name, email);

    const client = await pool.connect();
  
    try {
      const result = await createUser(name, email, "user");
  
      console.log(`User added with id: ${result.id}`)
  
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  
  });


export default router;
