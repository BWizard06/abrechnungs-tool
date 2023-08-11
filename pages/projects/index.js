import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function Projekte() {
    const [projekte, setProjekte] = useState([]);
    const [username, setUsername] = useState("");
    const router = useRouter();

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
        fetch("/api/project/getProjects")
            .then((res) => res.json())
            .then((data) => {
                setProjekte(data);
            });
    }, []);

    const deleteProject = async (projectId) => {
        if (confirm("Möchten Sie dieses Projekt wirklich löschen?")) {
            try {
                await fetch("/api/project/deleteProject", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: projectId }),
                });
                // Aktualisiere die Projekte, indem du die gelöschten entfernst
                setProjekte(
                    projekte.filter((projekt) => projekt.id !== projectId)
                );
            } catch (error) {
                console.error("Fehler beim Löschen des Projekts:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-10 left-4">
                {" "}
                {/* Positioniert den Button oben links */}
                <Link href="/">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">
                        Zurück zum Dashboard
                    </button>
                </Link>
            </div>
            <div className="max-w-md mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    {" "}
                    {/* Gibt dem Titel und dem Link Raum */}
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Projekte
                    </h2>
                    <Link href="/projects/create">
                        <span className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">
                            Neues Projekt
                        </span>
                    </Link>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm space-y-4">
                    {projekte.map((projekt) => (
                        <div
                            key={projekt.id}
                            className="block p-2 border border-gray-300 rounded-md hover:bg-indigo-50 focus:ring-indigo-500 focus:ring cursor-pointer mb-4 relative"
                        >
                            <Link
                                href={`/projects/change?projectId=${projekt.id}`}
                            >
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
                                >
                                    <FaEdit />
                                </button>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProject(projekt.id);
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <FaTrash />
                            </button>
                            <Link href={`/projects/${projekt.id}`}>
                                <div>
                                    <h3 className="text-lg font-semibold text-indigo-600">
                                        {projekt.name}
                                    </h3>
                                    <p className="text-gray-700">
                                        Kunde: {projekt.kunde}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Lieferantenrechnungen:{" "}
                                        {projekt.rechnungen.length}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
