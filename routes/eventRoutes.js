import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/edge.js';


dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

router.get("/:userId", async (req, res) => {
    const { id, userId } = req.params;
    const events = await prisma.historicalEventsPetOwner.findMany({
        where: {
            ownerId: parseInt(userId),
        },
        include: {
            event: true,
            pet: true,
            owner: true,
        }
    });

    res.json(events);
});

router.get("/single/:id", async (req, res) => {
    const { id } = req.params;
    const event = await prisma.historicalEventsPetOwner.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            event: true,
            pet: true,
            owner: true,
        }
    });

    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
});

router.post("/add-event", async (req, res) => {
    const { user, dateStr, selectedPet, eventType, eventTitle, eventDescription, eventCity, eventAddress, eventPostal } = req.body;
    if (!user || !dateStr || !selectedPet || !eventType || !eventTitle || !eventDescription || !eventCity || !eventAddress || !eventPostal) {
        return res.status(400).json({ error: "All fields are required" });
    }
    console.log("Received data:", req.body);

    const event = await prisma.event.create({
        data: {
            address: eventAddress,
            city: eventCity,
            desc: eventDescription,
            name: eventTitle,
            postal: eventPostal,
            typeId: parseInt(eventType),
        }
    })
    const result = await prisma.historicalEventsPetOwner.create({
        data: {
            ownerId: parseInt(user),
            petId: parseInt(selectedPet),
            eventId: event.id,
            date: new Date(dateStr),
            assits: true
        }
    });

    res.json({ message: "Event added successfully!", event: result });
});



export default router;