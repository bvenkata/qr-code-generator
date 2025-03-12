const express = require("express");
const QRCode = require("qrcode");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate-qr", async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ error: "Missing data" });

        const qrCodePath = path.join(__dirname, "qr-code.png");
        await QRCode.toFile(qrCodePath, data);

        res.sendFile(qrCodePath);
    } catch (error) {
        res.status(500).json({ error: "Failed to generate QR code" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
