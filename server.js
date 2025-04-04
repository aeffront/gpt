


import express from "express";
import cors from "cors";
import fetch from "node-fetch";


const app = express();
const PORT = 3000;  // Proxy server runs here

app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON requests

app.post("/api/gemma", async (req, res) => {
    try {
        const response = await fetch("http://localhost:1234/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error connecting to LM Studio:", error);
        res.status(500).json({ error: "Error connecting to LM Studio API" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
