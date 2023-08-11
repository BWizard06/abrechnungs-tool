import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end(); // Methode nicht erlaubt, wenn nicht GET
    }

    const projectId = req.query.projectId;

    if (!projectId) {
        return res.status(400).json({ error: "Projekt-ID ist erforderlich" });
    }

    try {
        const project = await prisma.projekt.findUnique({
            include: {
                rechnungen: true,
            },
            where: {
                id: parseInt(projectId, 10),
            },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Projekt-Rechnungen");

        // Spalten definieren
        worksheet.columns = [
            { header: "Kunde", key: "kunde", width: 14 },
            { header: "Projekt", key: "projekt", width: 14 },
            { header: "Leistung", key: "leistung", width: 14 },
            { header: "Lieferant", key: "lieferant", width: 14 },
            { header: "Beschreibung", key: "beschreibung", width: 20 }, // Neu hinzugefügt
            {
                header: "Re-Datum",
                key: "re_datum",
                width: 14,
                style: { numFmt: "DD.MM.YYYY" },
            },
            {
                header: "Betrag exkl. MwSt.",
                key: "betrag_exkl",
                width: 20,
                style: { numFmt: "#,##0.00 [$CHF]" },
            },
            {
                header: "Betrag inkl. MwSt.",
                key: "betrag_inkl",
                width: 20,
                style: { numFmt: "#,##0.00 [$CHF]" },
            },
            {
                header: "Offerte",
                key: "offerte",
                width: 14,
                style: { numFmt: "#,##0.00 [$CHF]" },
            },
            {
                header: "Differenz",
                key: "differenz",
                width: 14,
                style: { numFmt: "#,##0.00 [$CHF]" },
            },
            {
                header: "An Kunde verrechnet",
                key: "an_kde_verrechnet",
                width: 20,
                style: { numFmt: "DD.MM.YYYY" },
            },
        ];

        worksheet.getRow(1).font = { bold: true };

        // Datenmapping
        const data = project.rechnungen.map((rechnung) => ({
            kunde: project.kunde,
            projekt: project.name,
            leistung: rechnung.leistung,
            lieferant: rechnung.lieferant,
            beschreibung: rechnung.beschreibung,
            re_datum: rechnung.re_datum
                ? new Date(rechnung.re_datum).toLocaleDateString()
                : "",
            betrag_exkl: parseFloat(rechnung.betrag_exkl) || 0,
            betrag_inkl: parseFloat(rechnung.betrag_inkl) || 0,
            offerte: parseFloat(rechnung.offerte) || 0,
            differenz: parseFloat(rechnung.differenz) || 0,
            an_kde_verrechnet: rechnung.an_kde_verrechnet
                ? new Date(rechnung.an_kde_verrechnet).toLocaleDateString()
                : "",
        }));

        worksheet.addRows(data);

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=projekt-${projectId}-rechnungen.xlsx`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.send(buffer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Ein Fehler ist aufgetreten beim Abrufen der Rechnungen",
        });
    }
}
