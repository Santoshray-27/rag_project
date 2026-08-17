const express = require("express");

const app = express();
const PORT = 5000;

// Health route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DocuMind API is running",
    });
});

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to DocuMind Backend");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


