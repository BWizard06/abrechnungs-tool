import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ProjektDetail() {
    const [project, setProject] = useState(null);
    const router = useRouter();
    const { projectId } = router.query;
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("user_token");

        fetch("/api/verifyToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.valid) {
                    setUsername(data.username);
                    // Wenn das Token ungültig ist oder abgelaufen ist, leite zur Anmeldeseite weiter
                } else {
                    router.push("/login");
                }
            });
    }, []);

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/getProjectById?projectId=${projectId}`)
                .then((res) => res.json())
                .then((data) => {
                    setProject(data);
                });
        }
    }, [projectId]);

    function exportToExcel() {
        fetch(`/api/project/exportProjectToExcel?projectId=${projectId}`)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${project.name}_Rechnungen.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) =>
                console.error("Fehler beim Exportieren der Excel-Datei:", error)
            );
    }

    function deleteBill(billId) {
        // Bestätigung vom Benutzer anfordern
        if (window.confirm("Möchtest du diese Rechnung wirklich löschen?")) {
            fetch(`/api/bill/deleteBill`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ billId }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        // Die Rechnung aus dem lokalen Zustand entfernen
                        const updatedRechnungen = project.rechnungen.filter(
                            (rechnung) => rechnung.id !== billId
                        );

                        setProject({
                            ...project,
                            rechnungen: updatedRechnungen,
                        });
                    } else {
                        console.error(
                            "Fehler beim Löschen der Rechnung:",
                            data.error
                        );
                    }
                })
                .catch((error) =>
                    console.error("Fehler beim Löschen der Rechnung:", error)
                );
        }
    }

    function formatDate(dateString) {
        if (!dateString) return ""; // Wenn der dateString falsy ist, geben Sie einen leeren String zurück
        return new Date(dateString).toLocaleDateString();
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-10 left-4">
                <Link href="/">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">
                        Zurück zum Dashboard
                    </button>
                </Link>
            </div>
            <div className="max-w-5xl mx-auto space-y-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Projekt Details
                </h2>
                {project && (
                    <div>
                        <div className="bg-white p-4 rounded-md shadow-sm space-y-4">
                            <h3 className="text-xl font-semibold text-indigo-600">
                                {project.name}
                            </h3>
                            <p className="text-gray-700">
                                Kunde: {project.kunde}
                            </p>
                        </div>
                        <div className="mt-8 ">
                            <div className="mt-8 flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Rechnungen:
                                </h4>
                                <button
                                    onClick={exportToExcel}
                                    className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Exportieren als Excel
                                </button>
                            </div>
                            <table className="min-w-full bg-white border border-gray-300 rounded-md">
                                <thead className="bg-indigo-100">
                                    <tr>
                                        <th className="w-28 py-2 px-4 text-left text-gray-700">
                                            Leistung
                                        </th>
                                        <th className="w-28 py-2 px-4 text-left text-gray-700">
                                            Lieferant
                                        </th>
                                        <th className="w-28 py-2 px-4 text-left text-gray-700">
                                            Rechnungs Datum
                                        </th>
                                        <th className="w-32 py-2 px-4 text-left text-gray-700">
                                            Betrag exkl. MwSt.
                                        </th>
                                        <th className="w-32 py-2 px-4 text-left text-gray-700">
                                            Betrag inkl. MwSt.
                                        </th>
                                        <th className="w-28 py-2 px-4 text-left text-gray-700">
                                            Offerte
                                        </th>
                                        <th className="w-32 py-2 px-4 text-left text-gray-700">
                                            Differenz
                                        </th>
                                        <th className="w-32 py-2 px-4 text-left text-gray-700">
                                            An Kunde verrechnet
                                        </th>
                                        <th className="w-12 py-2 px-4 text-left text-gray-700"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.rechnungen.map(
                                        (rechnung, index) => (
                                            <tr
                                                key={rechnung.id}
                                                className={
                                                    index % 2 === 0
                                                        ? "bg-gray-50"
                                                        : ""
                                                }
                                            >
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {rechnung.leistung}
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {rechnung.lieferant}
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {formatDate(
                                                        rechnung.re_datum
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {rechnung.betrag_exkl} CHF
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {rechnung.betrag_inkl} CHF
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {rechnung.offerte} CHF
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {rechnung.differenz} CHF
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    {formatDate(
                                                        rechnung.an_kde_verrechnet
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b text-gray-900">
                                                    <Link
                                                        href={`/bills/change?id=${rechnung.id}`}
                                                    >
                                                        <button className="text-blue-500 hover:text-blue-700">
                                                            <FaEdit />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            deleteBill(
                                                                rechnung.id
                                                            )
                                                        }
                                                    >
                                                        <FaTrash className="text-red-500 hover:text-red-700" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
