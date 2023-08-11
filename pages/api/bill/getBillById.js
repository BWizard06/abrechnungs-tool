import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Methode nicht erlaubt, wenn nicht GET
  }

  const billId = req.query.id;

  if (!billId) {
    return res.status(400).json({ error: "rechnungs-ID ist erforderlich" });
  }

  try {
    // Hole alle Stunden für das gegebene Projekt
    const bill = await prisma.rechnung.findUnique({
      where: {
        id: parseInt(billId, 10),
      },
    });

    return res.json(bill);
  } catch (error) {
    console.error("Fehler beim Abrufen der Rechnung:", error.message);
    return res.status(500).json({ error: "Ein Fehler ist aufgetreten beim Abrufen der Rechnungen" });
  }
}
