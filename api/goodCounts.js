const admin = require("firebase-admin");

const serviceAccount = require("../netzero1-fc5e6-firebase-adminsdk-fbsvc-0cdbafd758.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://netzero1-fc5e6-default-rtdb.firebaseio.com/",
});

const db = admin.database();

module.exports = async (req, res) => {
  try {
    const snapshot = await db.ref("goodCounts").once("value");
    const goodCounts = snapshot.val() || {};

    // データ構造の最適化例: 特定の日付のグッド数のみを取得
    const date = req.query.date; // クライアントから日付を受け取る
    const dateGoodCounts = date ? goodCounts[date] || 0 : goodCounts; // 日付が指定された場合は、その日付のグッド数を取得

    res.status(200).json(dateGoodCounts); // 修正: 特定の日付のグッド数を返す

  } catch (error) {
    console.error("Error getting good counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
