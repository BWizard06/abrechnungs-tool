import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  if (req.method === 'GET') {
    try {
      const projekte = await prisma.projekt.findMany({
        include: {
          rechnungen: true,
        },
      });
      res.json(projekte);
    } catch (error) {
      res.status(400).json({ error: 'Fehler beim Abrufen der Projekte', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
