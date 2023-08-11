import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Methode nicht erlaubt, wenn nicht GET
  }

  const projectId = req.query.projectId;

  if (!projectId) {
    return res.status(400).json({ error: "Projekt-ID ist erforderlich" });
  }

  try {
    // Hole alle Stunden für das gegebene Projekt
    const project = await prisma.projekt.findUnique({
      include: {
        rechnungen: true,
      },
      where: {
        id: parseInt(projectId, 10),
      },
    });

    return res.json(project);
  } catch (error) {
    console.error("Fehler beim Abrufen des Projekts:", error.message);
    return res.status(500).json({ error: "Ein Fehler ist aufgetreten beim Abrufen der Rechnungen" });
  }
}
