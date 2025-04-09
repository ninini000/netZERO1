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

document.addEventListener("DOMContentLoaded", function () {
    const goodButtons = document.querySelectorAll(".goodmark-button");
    const messagePopup = document.getElementById("messagePopup");
    const closePopup = document.getElementById("closePopup");
    const sendMessage = document.getElementById("sendMessage");
    const messageInput = document.getElementById("messageInput");

    let currentGoodId = null; // 押されたグッドボタンのID

    goodButtons.forEach(button => {
        let id = button.getAttribute("data-id");
        let storedCount = localStorage.getItem("goodCount_" + id); // 文字列のまま取得

        // ✅ 「いいね」が押されていたら緑のボタンにする
        if (storedCount === "1") {
            button.querySelector(".goodmark-image").src = "グッドマーク_緑.png";
            button.classList.add("clicked");
        } else {
            button.querySelector(".goodmark-image").src = "グッドマーク.png"; // 初期状態の白いボタン
            button.classList.remove("clicked");
        }

        // ✅ グッドボタンのクリックイベント
        button.addEventListener("click", function (event) {
            let currentCount = localStorage.getItem("goodCount_" + id); // 文字列のまま取得

            if (this.classList.contains("clicked")) {
                // ✅ いいね取り消し
                localStorage.setItem("goodCount_" + id, "0");
                this.querySelector(".goodmark-image").src = "グッドマーク.png";
                this.classList.remove("clicked");
                messagePopup.style.display = "none"; // ポップアップを非表示にする
                // Firebaseにグッド数を保存
                db.ref("goodCounts").child(id).set(0);
            } else {
                // ✅ いいね付与
                localStorage.setItem("goodCount_" + id, "1");
                this.querySelector(".goodmark-image").src = "グッドマーク_緑.png";
                this.classList.add("clicked");

                // ✅ 押したボタンの上にポップアップを表示
                let rect = this.getBoundingClientRect();
                let scrollTop = window.scrollY || document.documentElement.scrollTop;

                messagePopup.style.display = "none"; // 最初に非表示にする
                setTimeout(() => {
                    messagePopup.style.left = (rect.left + window.scrollX - 30) + "px";
                    messagePopup.style.top = (rect.top + scrollTop - messagePopup.offsetHeight - 10) + "px";
                    messagePopup.style.display = "block"; // 位置が計算された後に表示する
                }, 0);

                currentGoodId = id;
                // Firebaseにグッド数を保存
                db.ref("goodCounts").child(id).set(1);
            }
        });
    });

    // ✅ バツボタンでポップアップを閉じる
    closePopup.addEventListener("click", function () {
        messagePopup.style.display = "none";
    });

    // ✅ パネルをシャッフルするコードをここに追加
    const container = document.querySelector(".panel-container");
    if (container) {
        const panels = Array.from(container.children);

        if (panels.length > 0) {
            // パネルをシャッフル
            panels.sort(() => Math.random() - 0.5);

            // 並べ替えたパネルをコンテナに再配置
            panels.forEach(panel => container.appendChild(panel));
        }
    }

    // ✅ メッセージを送信
    sendMessage.addEventListener("click", function () {
        let message = messageInput.value.trim();
        if (message === "") return;

        db.ref("messages").push({
            goodId: currentGoodId,
            text: message
        });

        messagePopup.style.display = "none";
        messageInput.value = "";

        // ✅ 感謝メッセージを表示
        let goodButton = document.querySelector(`.goodmark-button[data-id="${currentGoodId}"]`);
        let thankYouMessage = document.createElement("p");
        thankYouMessage.textContent = "メッセージが届きました！";
        thankYouMessage.classList.add("thank-you-message");
        goodButton.appendChild(thankYouMessage);

        setTimeout(() => {
            thankYouMessage.remove();
        }, 3000);
    });
});

function getGoodCounts() {
    db.ref("goodCounts").once("value").then(snapshot => {
        const goodData = snapshot.val() || {};
        console.log(goodData);
        // 取得したデータを表示する処理
    }).catch(error => {
        console.error("Error getting good counts:", error);
    });
}

getGoodCounts();
