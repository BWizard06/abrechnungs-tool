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

    const { id, ...updatedBill } = req.body;

    if (!id) {
        console.log("Fehlende ID:", req.body);
        return res
            .status(400)
            .json({ error: "Rechnungs-ID und Daten sind erforderlich" });
    }
    console.log("Aktualisierte Rechnung:", updatedBill); 

    try {
        const bill = await prisma.rechnung.update({
            where: { id: Number(id) },
            data: updatedBill,
        });

        return res.status(200).json(bill);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                error: "Ein Fehler ist aufgetreten beim Aktualisieren der Rechnung",
            }); // Fehlerantwort
    }
}
