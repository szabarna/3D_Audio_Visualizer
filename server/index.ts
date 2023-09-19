import bodyParser from 'body-parser';
import musicRoutes from './routes/musicRoutes';
import dotenv from 'dotenv';

let express = require('express');
let cors = require('cors');

dotenv.config();

const app = express();
app.use( cors() );
app.use( bodyParser.json() )

app.use("/api/audio", musicRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
