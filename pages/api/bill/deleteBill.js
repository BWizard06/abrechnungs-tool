import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const { billId } = req.body;

  if (!billId) {
    return res.status(400).json({ error: "Rechnungs-ID ist erforderlich" });
  }

  try {
    await prisma.rechnung.delete({
      where: { id: parseInt(billId, 10) },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Ein Fehler ist beim Löschen der Rechnung aufgetreten" });
  }
}
