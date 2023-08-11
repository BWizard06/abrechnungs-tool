import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const count = await prisma.rechnung.count();
  res.json( count );
}
