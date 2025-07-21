//const express = require('express');
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '../generated/prisma/edge.js';


const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
    //const { email, password } = req.body;
    console.log(req.body)
    const { username, email, password, country, city, address, postal } = req.body;

    try {
        //const exists = await User.findOne({ email });
        const exists = await prisma.user.findFirst({ where: { email }});
        //const prueba = await prisma.user.findMany({where: { email }})
        //console.log(prueba)


        if (exists) 
            return res.status(400).json({ error: 'Ya existe ese usuario' });

        const hashed = await bcrypt.hash(password, 10);
        //const user = await User.create({ email, password: hashed });
        const user = await prisma.user.create({
            data: { username, email, password: hashed, country, city, address, postal}
        });
        if (user){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ token });
        }


    } catch (err) {
      res.status(500).json({ error: 'Error al registrar' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        //const user = await User.findOne({ email });
        const user = await prisma.user.findUnique({ where: { email }})

        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(400).json({ error: 'Credenciales incorrectas' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user.id, name: user.username,email: user.email } });

    } catch {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },
);

export default router;