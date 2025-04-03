const admin = require("firebase-admin");

    const serviceAccount = require("./serviceAccountKey.json");
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://console.firebase.google.com/u/0/project/netzero1-fc5e6/database/netzero1-fc5e6-default-rtdb/data/~2F?hl=ja",
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
