// Firebase設定（index.jsと同じものを貼り付け）
const firebaseConfig = {
    apiKey: "AIzaSyBXOBFzV7Kk0zjXnrWtrPEb101R3Xmew_c",
    authDomain: "netzero1-fc5e6.firebaseapp.com",
    databaseURL: "https://netzero1-fc5e6-default-rtdb.firebaseio.com",
    projectId: "netzero1-fc5e6",
    storageBucket: "netzero1-fc5e6.firebasestorage.app",
    messagingSenderId: "1089803832530",
    appId: "1:1089803832530:web:9216e96f2df305b2b7f10b",
    measurementId: "G-1FN7CQEHK3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// グッド数を表示
db.ref("goodCounts").on("value", snapshot => {
    const goodData = snapshot.val() || {};
    const goodCountsList = document.getElementById("goodCountsList");
    goodCountsList.innerHTML = ""; // リストをクリア

    Object.entries(goodData).forEach(([goodId, users]) => {
        const count = Object.keys(users).length;
        const li = document.createElement("li");
        li.textContent = `作品 ${goodId}: ${count} グッド`;
        goodCountsList.appendChild(li);
    });
});

// メッセージを表示
db.ref("messages").on("value", snapshot => {
    const messagesData = snapshot.val() || {};
    const messagesList = document.getElementById("messagesList");
    messagesList.innerHTML = ""; // リストをクリア

    Object.entries(messagesData).forEach(([key, message]) => {
        const li = document.createElement("li");
        li.textContent = `作品 ${message.goodId}: ${message.text}`;
        messagesList.appendChild(li);
    });
});
