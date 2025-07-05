const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 3001;
dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello World desde Express');
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
