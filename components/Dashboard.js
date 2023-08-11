import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";


export default function Dashboard() {
    const [projectsCount, setProjectsCount] = useState(0);
    const [billsCount, setBillsCount] = useState(0);
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
        fetch("/api/project/getProjectsCount")
            .then((res) => res.json())
            .then((data) => setProjectsCount(data));
        fetch("/api/bill/getBillsCount")
            .then((res) => res.json())
            .then((data) => setBillsCount(data));
    }, []);

    const exportAllBillsToExcel = () => {
        fetch("/api/bill/exportBillsToExcel")
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "alle-rechnungen.xlsx";
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) =>
                console.error("Fehler beim Exportieren der Excel-Datei:", error)
            );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-gray-900">Dashboard</h2>
              <div className="space-x-4 text-indigo-600">
                <Link href="/bills/create">Rechnungen erstellen</Link>
                <Link href="/projects/create">Projekte erstellen</Link>
                <Link href="/projects">Alle Projekte anzeigen</Link>
              </div>
            </div>
            <button
              onClick={exportAllBillsToExcel}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md mb-4"
            >
              Alle Rechnungen exportieren
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border rounded-md shadow-sm text-gray-900">
                <h3 className="text-lg font-semibold">Projekte</h3>
                <p>Anzahl Projekte: {projectsCount}</p>
              </div>
              <div className="p-4 bg-white border rounded-md shadow-sm text-gray-900">
                <h3 className="text-lg font-semibold">Rechnungen</h3>
                <p>Anzahl Rechnungen: {billsCount}</p>
              </div>
            </div>
            {/* Optionaler Grafikbereich */}
          </div>
        </div>
      );
      
}
