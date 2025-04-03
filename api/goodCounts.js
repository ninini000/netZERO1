const admin = require("firebase-admin");

    const serviceAccount = require("./path/to/your/serviceAccountKey.json");
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "YOUR_DATABASE_URL",
    });

    const db = admin.database();

    module.exports = async (req, res) => {
    try {
    const snapshot = await db.ref("goodCounts").once("value");
    const goodCounts = snapshot.val() || {};
    res.status(200).json(goodCounts);
    } catch (error) {
    console.error("Error getting good counts:", error);
    res.status(500).json({ error: "Internal server error" });
    }
    };
