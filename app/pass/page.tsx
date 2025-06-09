"use client"
import React from "react"
import { hashSync } from "bcrypt-ts";

export default function Pass() {
    const [hash, setHash] = React.useState("");

    React.useEffect(() => {
        const hash = hashSync("WCST@Admin1", 15);
        setHash(hash)
    }, [])
    return (
        <h1>Pass: {hash}</h1>
    )
}