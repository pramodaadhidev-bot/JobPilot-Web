export default async function handler(req, res) {
    try {
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        if (!appId || !appKey) {
            return res.status(500).json({
                error: "Adzuna API credentials are not configured."
            });
        }

        const what =
            typeof req.query.what === "string" && req.query.what.trim()
                ? req.query.what.trim()
                : "jobs";

        const where =
            typeof req.query.where === "string"
                ? req.query.where.trim()
                : "";

        const page =
            typeof req.query.page === "string" && req.query.page.trim()
                ? req.query.page.trim()
                : "1";

        const url =
            "https://api.adzuna.com/v1/api/jobs/in/search/" +
            encodeURIComponent(page) +
            "?app_id=" + encodeURIComponent(appId) +
            "&app_key=" + encodeURIComponent(appKey) +
            "&results_per_page=50" +
            "&what=" + encodeURIComponent(what) +
            "&where=" + encodeURIComponent(where) +
            "&content-type=application/json";

        const response = await fetch(url);
        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            data = {
                error: "Invalid response received from Adzuna."
            };
        }

        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Adzuna API error:", error);

        return res.status(500).json({
            error: "Unable to fetch jobs from Adzuna."
        });
    }
}
