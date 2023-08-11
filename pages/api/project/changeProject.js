import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).end(); // Methode nicht erlaubt, wenn nicht PUT
    }

    const token = req.headers["authorization"]?.split(" ")[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: "Ungültiger Token" });
    }

    const userName = decodedToken.username;

    const { id, ...updatedProject } = req.body;

    if (!id || !updatedProject) {
        return res
            .status(400)
            .json({ error: "Projekt-ID und Daten sind erforderlich" });
    }

    try {
        const project = await prisma.projekt.update({
            where: { id: Number(id) },
            data: updatedProject,
        });

        return res.status(200).json(project);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Fehler beim Aktualisieren des Projekts" });
    }
}
