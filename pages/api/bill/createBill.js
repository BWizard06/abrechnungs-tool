import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).end(); // Methode nicht erlaubt, wenn nicht POST
    }

    const token = req.headers["authorization"]?.split(" ")[1];

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Ungültiger Token" });
    }

    const userName = decodedToken.username;
  
    const {
      projekt_id,
      leistung,
      lieferant,
      beschreibung,
      re_datum,
      betrag_exkl,
      betrag_inkl,
      offerte,
      differenz,
      an_kde_verrechnet,
    } = req.body;

    const projektIdAsInt = parseInt(projekt_id, 10);
  
    try {
      const createdBill = await prisma.rechnung.create({
          data: {
              projekt_id: projektIdAsInt,
              leistung: leistung || null, 
              lieferant: lieferant || null, 
              beschreibung: beschreibung || null, 
              re_datum: re_datum ? new Date(re_datum) : null,
              betrag_exkl: betrag_exkl ? parseFloat(betrag_exkl) : 0.00,
              betrag_inkl: betrag_inkl ? parseFloat(betrag_inkl) : 0.00,
              offerte: offerte ? parseFloat(offerte) : 0.00,
              differenz: differenz ? parseFloat(differenz) : 0.00,
              an_kde_verrechnet: an_kde_verrechnet ? new Date(an_kde_verrechnet) : null,
              user_name: userName,
          },
      });

      return res.json(createdBill);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ein Fehler ist aufgetreten beim Erfassen der Stunden' }); // Fehlerantwort
    }
  }