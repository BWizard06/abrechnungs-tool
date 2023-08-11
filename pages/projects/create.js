import React from 'react'
import CreateProjectForm from '@/components/createProjectForm'
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function createProject() {

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
  return (
    <CreateProjectForm />
  )
}
