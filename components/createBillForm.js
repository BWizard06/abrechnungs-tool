import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CreateBillForm() {
    // Zustandsvariablen
    const [projekte, setProjekte] = useState([]);
    const [selectedProjekt, setSelectedProjekt] = useState("");
    const [leistung, setLeistung] = useState("");
    const [lieferant, setLieferant] = useState("");
    const [beschreibung, setBeschreibung] = useState("");
    const [re_datum, setRe_datum] = useState("");
    const [betrag_exkl, setBetrag_exkl] = useState("");
    const [offerte, setOfferte] = useState("");
    const [an_kde_verrechnet, setAn_kde_verrechnet] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const cleanNumber = (num) => {
        return parseFloat(num.replace(/[^0-9.]/g, ''));
    }

    // Funktion zum Absenden des Formulars
    const handleSubmit = async () => {
        const cleanedBetrag_exkl = cleanNumber(betrag_exkl);
        const cleanedOfferte = cleanNumber(offerte);
        const berechneteDifferenz = cleanedBetrag_exkl - cleanedOfferte;
        const betrag_inkl = cleanedBetrag_exkl * 1.077;
        const token = localStorage.getItem("user_token");

        const data = {
            projekt_id: selectedProjekt,
            leistung,
            lieferant,
            beschreibung,
            re_datum,
            betrag_exkl: cleanedBetrag_exkl,
            betrag_inkl,
            offerte: cleanedOfferte,
            differenz: berechneteDifferenz,
            an_kde_verrechnet,
        };

        const response = await fetch("/api/bill/createBill", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            setSuccessMessage("Rechnung erfolgreich erfasst!");
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.error || "Ein Fehler ist aufgetreten");
        }
    };

    // Checkt beim Laden der Komponente, ob der User eingeloggt ist

    // Projekte beim Laden der Komponente abrufen
    useEffect(() => {
        fetch("/api/project/getProjects")
            .then((res) => res.json())
            .then((data) => {
                setProjekte(data);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-14 left-4">
                <Link href="/">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">
                        Zurück zum Dashboard
                    </button>
                </Link>
            </div>
            <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    Lieferantenrechnungen erfassen
                </h2>
                <div className="rounded-md shadow-sm -space-y-px">
                    <select
                        value={selectedProjekt}
                        onChange={(e) => setSelectedProjekt(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    >
                        <option value="" disabled hidden>
                            Projekt auswählen...
                        </option>
                        {projekte.map((projekt) => (
                            <option key={projekt.id} value={projekt.id}>
                                {projekt.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Leistung"
                        value={leistung}
                        onChange={(e) => setLeistung(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Lieferant"
                        value={lieferant}
                        onChange={(e) => setLieferant(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Beschreibung"
                        value={beschreibung}
                        onChange={(e) => setBeschreibung(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="date"
                        value={re_datum}
                        onChange={(e) => setRe_datum(e.target.value)}
                        title="Rechnungsdatum"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Betrag exkl. MwSt."
                        value={betrag_exkl}
                        onChange={(e) => setBetrag_exkl(e.target.value)}
                        title="Betrag exkl. MwSt."
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Offerte"
                        value={offerte}
                        onChange={(e) => setOfferte(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                    />
                    <input
                        type="date"
                        value={an_kde_verrechnet}
                        onChange={(e) => setAn_kde_verrechnet(e.target.value)}
                        title="An Kunde verrechnet"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                </div>
                {/* Button zum Absenden des Formulars */}
                <div className="flex items-center mt-10 justify-center">
                    <button
                        onClick={handleSubmit}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Lieferantenrechnung erfassen
                    </button>
                </div>
                {successMessage && (
                    <div className="text-green-500 text-center mt-2">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="text-red-500 text-center mt-2">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
