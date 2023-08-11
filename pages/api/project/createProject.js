import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    if(req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'})
    } else {
        const { name, kunde } = req.body;
        try {
            const projekt = await prisma.projekt.create({
                data: {name, kunde},
            })
            res.json(projekt);
        } catch (error) {
            res.status(500).json({ error: 'Fehler beim Erstellen des Projekts', details: error.message })
        }
    }
}