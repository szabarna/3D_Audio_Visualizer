import musicRoutes from './routes/musicRoutes.js';
import dotenv from 'dotenv';
import downloadRoutes from './routes/downloadRoutes.js';
import userRoutes from './routes/userRoute.js'
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use( cors() );
app.use( bodyParser.json() )

app.use("/api", musicRoutes);
app.use("/api/download", downloadRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
