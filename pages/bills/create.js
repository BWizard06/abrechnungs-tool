import React from "react";
import CreateBillForm from "@/components/createBillForm";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function createBill() {
    const router = useRouter();
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
    return <CreateBillForm />;
}
