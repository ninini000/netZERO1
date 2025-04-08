import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://netzero1-fc5e6-default-rtdb.firebaseio.com/",
  });
}

const db = admin.database();

export default async function handler(req, res) {
  try {
    const snapshot = await db.ref("goodCounts").once("value");
    const goodCounts = snapshot.val() || {};
    res.status(200).json(goodCounts);
  } catch (error) {
    console.error("Error getting good counts:", error);
    res.status(200).json({});
  }
}
