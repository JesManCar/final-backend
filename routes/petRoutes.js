import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/edge.js';
import uploadMiddleware from '../middleware/uploadCloudinaryMiddleware.js';
const upload = uploadMiddleware("images");


dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

router.get("/pet/:id", async (req, res) => {
    const petId = req.params.id;
    const pet = await prisma.pet.findUnique({
        where: {
            id : parseInt(petId)
        }
    })
    if (!pet) return res.status(404).json({ error: "Pet not find" });
    
    return res.json(pet)
})
router.get("/pets/:id", async (req, res) => {
    try{
        /*
        const pets = await prisma.historicalPetsOwner.findMany({
            where: { ownerId: parseInt(req.params.id) },
        });

        const petsId = pets.map(pet => pet.petId);

        if (!petsId || petsId.length === 0) {
            return res.status(404).json({ error: "No pets found for this user" });
        }

        const petsData = await prisma.pet.findMany({
            where: { id: { in: petsId } },
        });

        if (!petsData || petsData.length === 0) {
            return res.status(404).json({ error: "No pets found for this user" });
        }
        console.log("Mascotas del usuario:", petsData);
        return res.json(petsData);
        */
       const pets = await prisma.pet.findMany({
        include: {
            owners: true,
        },
        where: {
            owners: {
                every: {
                    ownerId: parseInt(req.params.id)
                }
            }
        }
       })
        if (!pets || pets.length === 0) {
            return res.status(404).json({ error: "No pets found for this user" });
        }
        console.log("Mascotas del usuario:", pets);
        
        return res.json(pets);

    } catch (error) {
        console.error("Error fetching pets:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.put("/update/:id", /*upload.single("image"),*/ async (req, res) => {
    const petId = req.params.id;
    console.log(req.body)
    const { name, birthday, breed } = req.body;
    const date = new Date(birthday);
    /*return res.json({
        message: "Pet updated successfully",
    });*/
    try {
        const updatedPet = await prisma.pet.update({
            where: { id: parseInt(petId) },
            data: { name, birthday: date, breed, image: req.file ? req.file.path : "No image uploaded" },
        });
        return res.json(updatedPet);
    } catch (error) {
        console.error("Error updating pet:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.delete("/delete/:id&:userId", async (req, res) => {
    const petId = req.params.id;
    const userId = req.params.userId;
    const ownerId = parseInt(userId.split('=')[1]);
    try {
        const petExists = await prisma.pet.findUnique({
            where: { id: parseInt(petId) },
        });
        if (!petExists) {
            return res.status(404).json({ error: "Pet not found" });
        }
        const owners = await prisma.historicalPetsOwner.deleteMany({
            where: { petId: parseInt(petId), ownerId: parseInt(ownerId) },
        });
        const deletedPet = await prisma.pet.delete({
            where: { id: parseInt(petId) },
        });
        return res.json(deletedPet);
    } catch (error) {
        console.error("Error deleting pet:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


export default router;