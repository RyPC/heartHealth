const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Allow connection from port 3000 (client)
app.use(
    cors({
        origin: "http://35.160.204.3:3000",
    })
);

// API GET data
app.get("/api/get_data", (req, res) => {
    // Read json file and parse to JS object
    const data = fs.readFileSync("data/data.json", "utf8");
    const json = JSON.parse(data);

    res.json(json);
});

// Checks if string is in valid datetime format
function isValidDate(dateString) {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime());
}
function isValidNumber(str) {
    const number = Number(str);
    return !isNaN(number) && str.trim() !== "" && !/^\s+$/.test(str); // check for empty or whitespace-only strings
}

function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // +1 because getMonth() returns 0-11
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// API "POST" (but using GET) data
app.get("/api/add_data/:heart_rate", async (req, res) => {
    // Check for valid arguments
    const heart_rate = parseInt(req.params.heart_rate);
    const timestamp = getCurrentTimestamp();

    try {
        if (typeof heart_rate !== "number") {
            return res.status(400).json({ message: "Invalid heart_rate" });
        }

        // Read json file so we can add
        const data = fs.readFileSync("data/data.json", "utf8");
        let json = JSON.parse(data);

        // Add new entry and update data file
        json.timestamps.push(timestamp);
        json.heart_rates.push(heart_rate);

        const new_data = JSON.stringify(json);
        fs.writeFileSync("data/data.json", new_data, "utf8");

        res.json({ timestamp: timestamp, heart_rate: heart_rate });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
