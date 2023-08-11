import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ChangeProjectForm from "@/components/changeProjectForm";

export default function Change() {
    const router = useRouter();
    const [username, setUsername] = useState("");

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

    return <ChangeProjectForm />;
}
