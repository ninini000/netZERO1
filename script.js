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

        // Firebaseからグッド数を取得して表示
        db.ref("goodCounts").child(id).once("value").then(snapshot => {
            const count = snapshot.val() || 0;
            updateGoodButton(button, count);
        }).catch(error => {
            console.error("グッド数の取得に失敗:", error);
        });

        // ✅ グッドボタンのクリックイベント
        button.addEventListener("click", function (event) {
            db.ref("goodCounts").child(id).once("value").then(snapshot => {
                const count = snapshot.val() || 0;
                const newCount = count === 1 ? 0 : 1;
                db.ref("goodCounts").child(id).set(newCount).then(() => {
                    updateGoodButton(button, newCount);
                    if (newCount === 0) {
                        messagePopup.style.display = "none";
                    } else {
                        showPopup(this);
                    }
                }).catch(error => {
                    console.error("グッド数の更新に失敗:", error);
                });
            }).catch(error => {
                console.error("グッド数の取得に失敗:", error);
            });
            currentGoodId = id;
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
        }).then(() => {
            messagePopup.style.display = "none";
            messageInput.value = "";
            showThankYouMessage();
        }).catch(error => {
            console.error("メッセージの送信に失敗:", error);
        });
    });
});

function updateGoodButton(button, count) {
    if (count === 1) {
        button.querySelector(".goodmark-image").src = "グッドマーク_緑.png";
        button.classList.add("clicked");
    } else {
        button.querySelector(".goodmark-image").src = "グッドマーク.png";
        button.classList.remove("clicked");
    }
}

function showPopup(button) {
    let rect = button.getBoundingClientRect();
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    messagePopup.style.display = "none";
    setTimeout(() => {
        messagePopup.style.left = (rect.left + window.scrollX - 30) + "px";
        messagePopup.style.top = (rect.top + scrollTop - messagePopup.offsetHeight - 10) + "px";
        messagePopup.style.display = "block";
    }, 0);
}

function showThankYouMessage() {
    let goodButton = document.querySelector(`.goodmark-button[data-id="${currentGoodId}"]`);
    let thankYouMessage = document.createElement("p");
    thankYouMessage.textContent = "メッセージが届きました！";
    thankYouMessage.classList.add("thank-you-message");
    goodButton.appendChild(thankYouMessage);

    setTimeout(() => {
        thankYouMessage.remove();
    }, 3000);
}

function getGoodCounts() {
    db.ref("goodCounts").once("value").then(snapshot => {
        const goodData = snapshot.val() || {};
        console.log("グッド数:", goodData);
        // 取得したデータを表示する処理
        // 例: goodList.innerHTML = JSON.stringify(goodData);
    }).catch(error => {
        console.error("グッド数の取得に失敗:", error);
    });
}

getGoodCounts();
