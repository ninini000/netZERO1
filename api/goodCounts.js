const admin = require("firebase-admin");

const serviceAccount = require("../netzero1-fc5e6-firebase-adminsdk-fbsvc-0cdbafd758.json"); // 修正: ファイル名を修正

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://netzero1-fc5e6-default-rtdb.firebaseio.com/", // 修正: データベースURLを修正
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
