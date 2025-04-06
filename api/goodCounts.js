const admin = require("firebase-admin");

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://netzero1-fc5e6-default-rtdb.firebaseio.com/",
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Firebaseの初期化に失敗しても何も返さない
}

const db = admin.database();

module.exports = async (req, res) => {
  try {
    const snapshot = await db.ref("goodCounts").once("value");
    const goodCounts = snapshot.val() || {};
    res.status(200).json(goodCounts);
  } catch (error) {
    console.error("Error getting good counts:", error);
    // ↓ エラー時でも空のオブジェクトを返して200にする（失敗表示を避ける）
    res.status(200).json({});
  }
};

