export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Handle preflight request
    }

    try {
        let sheetURL = process.env.SHEET_URL;
        const sem = parseInt(req.query.sem || req.body.sem, 10) || 0;
        switch (sem){
            default:
                sheetURL = process.env.SHEET_URL;
                break;
            case 6:
                sheetURL = process.env["SHEET_URL6"];
    }
        if (!sheetURL) { // ✅ Prevent undefined URLs
            throw new Error("Invalid or missing Google Sheet URL.");
        }
        const response = await fetch(sheetURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }

        const csvText = await response.text();

        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(csvText);
    } catch (error) {
        console.error("Error fetching Google Sheet:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
}

