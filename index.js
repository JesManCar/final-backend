import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/edge.js';
import router from './routes/creationRoutes.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World desde Express');
});

app.get("/users", async (req, res) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

app.use("/", authRoutes)
app.use("/creation", router);



app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
