import { useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export default function Home() {
    const router = useRouter();

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
                if (!data.valid) {
                    // Wenn das Token ungültig ist oder abgelaufen ist, leite zur Anmeldeseite weiter
                    router.push("/login");
                }
            });
    }, []);

    return (
        <div>
            <h1>Geschützte Seite</h1>
            <p>Nur angemeldete Benutzer können diese Seite sehen.</p>
        </div>
    );
}
