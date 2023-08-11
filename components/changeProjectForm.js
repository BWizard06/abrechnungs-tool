import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ChangeProjectForm() {
    const router = useRouter();
    const { projectId } = router.query;
    const [name, setName] = useState("");
    const [kunde, setKunde] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/getProjectById?projectId=${projectId}`)
                .then((res) => res.json())
                .then((data) => {
                    setName(data.name);
                    setKunde(data.kunde);
                });
        }
    }, [projectId]);

    const handleSubmit = async () => {
        const token = localStorage.getItem("user_token");
        try {
            const response = await fetch("/api/project/changeProject", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: projectId, name, kunde }),
            });

            if (response.ok) {
                const projekt = await response.json();
                setMessage(`Projekt "${projekt.name}" erfolgreich bearbeitet!`);
            } else {
                const error = await response.json();
                setMessage(`Fehler: ${error.error}`);
            }
        } catch (error) {
            setMessage(`Fehler beim Senden der Anfrage: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-20 left-4">
                <Link href="/">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">
                        Zurück zum Dashboard
                    </button>
                </Link>
            </div>
            <div className="max-w-md w-full mx-auto space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Projekt bearbeiten
                </h2>
                <div className="rounded-md shadow-sm -space-y-px">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Kunde"
                        value={kunde}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        onChange={(e) => setKunde(e.target.value)}
                    />
                </div>
                {message && (
                    <div className="text-green-500 text-center mt-2">
                        {message}
                    </div>
                )}
                <div className="flex items-center justify-center">
                    <button
                        onClick={handleSubmit}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Projekt aktualisieren
                    </button>
                </div>
            </div>
        </div>
    );
}
