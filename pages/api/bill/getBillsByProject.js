import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Methode nicht erlaubt, wenn nicht GET
  }

  const projektId = req.query.projektId;

  if (!projektId) {
    return res.status(400).json({ error: "Projekt-ID ist erforderlich" });
  }

  try {
    // Hole alle Stunden für das gegebene Projekt
    const bills = await prisma.rechnung.findMany({
      where: {
        projekt_id: parseInt(projektId, 10),
      },
    });

    return res.json(bills);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ein Fehler ist aufgetreten beim Abrufen der Rechnungen" });
  }
}
