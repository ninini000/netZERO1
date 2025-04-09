<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js"></script>

<script>
  // Firebase設定をここに貼り付け
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

  // Firebase初期化
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // ページが読み込まれたらデータを取得して表示
  document.addEventListener("DOMContentLoaded", function () {
    const goodList = document.getElementById("good-list");
    const messageList = document.getElementById("message-list");

    // グッド数の取得と表示
    db.ref("goodCounts").once("value").then(snapshot => {
      const goodData = snapshot.val() || {};

      Object.keys(goodData).forEach(key => {
        const count = goodData[key];
        const listItem = document.createElement("li");
        listItem.textContent = `作品${key} のグッド数: ${count}`;
        goodList.appendChild(listItem);
      });
    }).catch(error => {
      console.error("グッド数の取得に失敗:", error);
    });

    // メッセージの取得と表示
    db.ref("messages").once("value").then(snapshot => {
      const messageData = snapshot.val() || {};

      Object.keys(messageData).forEach(key => {
        const messages = messageData[key];
        if (Array.isArray(messages) && messages.length > 0) {
          const listItem = document.createElement("li");
          listItem.textContent = `作品${key} のメッセージ: ${messages.join(", ")}`;
          messageList.appendChild(listItem);
        }
      });
    }).catch(error => {
      console.error("メッセージの取得に失敗:", error);
    });
  });
</script>
