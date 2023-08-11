import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import Dashboard from "@/components/Dashboard";

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [projekte, setProjekte] = useState([]);
    const [selectedProjekt, setSelectedProjekt] = useState(null);
    const [rechnungen, setRechnungen] = useState([]);



    useEffect(() => {
        // Hole das Token aus dem Local Storage
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

    const handleProjektSelect = (projektId) => {
        setSelectedProjekt(projektId);
        fetch(`/api/bill/getBillsByProject?projektId=${projektId}`)
            .then((res) => res.json())
            .then((data) => setRechnungen(data));
    };

    return (
        <Dashboard />
    );
}
