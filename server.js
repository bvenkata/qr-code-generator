const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors());
app.use(express.json());

app.post("/generate-pass", async (req, res) => {
    try {
        console.log("test");
        const response = await fetch("https://api.passslot.com/v1/templates/4523222026551296/pass", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "tyKAtRMzkKRDNgccTfiChaWOCGuXKFXhDJebSHfCszeyRsIXQqfaIXpVdmvsIVNR" // Replace with your actual API key
            },
            body: JSON.stringify(req.body)
        });
        console.log(response);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log(error,"error");
        res.status(500).json({ error: "Failed to fetch PassSlot API", details: error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));