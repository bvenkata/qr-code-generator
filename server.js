const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://bvenkata:JesusJoe8@cluster0.yrwx6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Ensure this is the correct MongoDB Atlas connection string
const client = new MongoClient(uri);

app.post("/generate-pass", async (req, res) => {
    try {
        await client.connect();
        const database = client.db("managevent"); // Replace with your database name
        const collection = database.collection("register");

        const { phoneNumber, ...passData } = req.body;

        const existingRecord = await collection.findOne({ phoneNumber });

        if (existingRecord) {
            await collection.updateOne({ phoneNumber }, { $set: passData });
        } else {
            await collection.insertOne({ phoneNumber, ...passData });
        }

        const response = await fetch("https://api.passslot.com/v1/templates/4523222026551296/pass", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "tyKAtRMzkKRDNgccTfiChaWOCGuXKFXhDJebSHfCszeyRsIXQqfaIXpVdmvsIVNR" // Replace with your actual API key
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log(error, "error");
        res.status(500).json({ error: "Failed to fetch PassSlot API", details: error });
    } finally {
        await client.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));