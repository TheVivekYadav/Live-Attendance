export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Handle preflight request
    }

    try {
        const sheetURL = process.env.SHEET_URL;
        const sem = req.query.sem || req.body.sem;
        switch (parseInt(sem)){
            default:
                sheetURL = process.env.SHEET_URL;
                break;
            case 6:
                sheetURL = process.env.SHEET_URL6;
    }
        const response = await fetch(sheetURL);
        const csvText = await response.text();

        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(csvText);
    } catch (error) {
        console.error("Error fetching Google Sheet:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
}

