import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).end();
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Projekt-ID ist erforderlich" });
    }

    try {
        await prisma.projekt.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(200).json({ message: "Projekt gelöscht" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                error: "Ein Fehler ist aufgetreten beim Löschen des Projekts",
            });
    }
}
