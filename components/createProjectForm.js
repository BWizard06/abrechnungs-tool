import { useState } from "react";
import Link from "next/link";

export default function CreateProjectForm() {
    const [name, setName] = useState("");
    const [kunde, setKunde] = useState("");
    const [message, setMessage] = useState("");


    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/project/createProject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, kunde }),
            });

            if (response.ok) {
                const projekt = await response.json();
                setMessage(`Projekt "${projekt.name}" erfolgreich erstellt!`);
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
                {" "}
                {/* Zentriert das Formular */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Neues Projekt erstellen
                </h2>
                <div className="rounded-md shadow-sm -space-y-px">
                    <input
                        type="text"
                        placeholder="Name"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Kunde"
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
                        Projekt erstellen
                    </button>
                </div>
            </div>
        </div>
    );
}
