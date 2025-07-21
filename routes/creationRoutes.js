import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/edge.js';


dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

router.post("/user", async (req, res) => {
    const { username, email, password, country, city, address, postal } = req.body;
    const result = await prisma.user.create({
        data: {
        username,
        email,
        password,
        country,
        city,
        address,
        postal,
        }
    });
    res.json(result);
});

router.post("/pet", async (req, res) => {
    const { name, birthday, species, breed ,ownerId } = req.body;
    const date = new Date(birthday);
    if (!name || !birthday || !species || !breed || !ownerId) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const result = await prisma.pet.create({
        data: {
            name,
            birthday : date,
            species,
            breed,
        }
    });
    const historical = await prisma.historicalPetsOwner.create({
        data: {
            petId: result.id,
            ownerId: parseInt(ownerId)
        }
    });
    res.json(result);
});
router.post("/post", async (req, res) => {
    const {tittle, desc, ownerId, typeId} = req.body;
    if (!tittle || !desc || !ownerId || !typeId ) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const result = await prisma.posts.create({
        data: {
            tittle,
            desc,
            ownerId: parseInt(ownerId),
            typeId: parseInt(typeId)
        }
    })
    res.json(result);
})

router.post("/expenses", async (req, res) => {
    const { place, amount, ownerId, petId } = req.body;
    if (!place || !amount || !ownerId || !perId){
        return res.status(400).json({error: "All fields are required"});
    }
    const result = await prisma.expensesPetOwner.create({
        data: {
            place,
            amount,
            ownerId: parseInt(ownerId),
            petId: parseInt(petId)
        }
    })
    res.json(result);
})

router.post("/treatments", async (req, res) => {
    const { doctor, place, treatment, ownerId, petId } = req.body;
    if (!doctor || !place || !treatment || !ownerId || !petId ){
        return res.status(400).json({error: "All fields are required"});
    }
    const result = await prisma.treatmentsPetOwner.create({
        data: {
            doctor,
            place,
            treatment,
            ownerId: parseInt(ownerId),
            petId: parseInt(petId)
        }
    })
    res.json(result);
})




export default router;