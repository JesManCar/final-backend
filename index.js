import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/edge.js';
import router from './routes/creationRoutes.js';
import pets from './routes/petRoutes.js';
import authRoutes from './routes/authRoutes.js'
import eventsRoutes from './routes/eventRoutes.js';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'https://sweet-fudge-b86efd.netlify.app', //Frontend origin
  credentials: true,
  optionSuccessStatus: 200
}


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

app.get('/', (req, res) => {
  res.send('Hello World desde Express');
});

app.get("/users", async (req, res) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

app.use("/", authRoutes)
app.use("/", pets);
app.use("/creation", router);
app.use("/events", eventsRoutes);

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
