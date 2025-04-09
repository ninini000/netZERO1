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

        // ✅ Firebaseからグッド数を取得してボタンを初期化
        db.ref("goodCounts").child(id).once("value").then(snapshot => {
            const count = snapshot.val() || 0;
            if (count === 1) {
                button.querySelector(".goodmark-image").src = "グッドマーク_緑.png";
                button.classList.add("clicked");
            } else {
                button.querySelector(".goodmark-image").src = "グッドマーク.png";
                button.classList.remove("clicked");
            }
        });

        // ✅ グッドボタンのクリックイベント
        button.addEventListener("click", function (event) {
            db.ref("goodCounts").child(id).once("value").then(snapshot => {
                const count = snapshot.val() || 0;
                const newCount = count === 1 ? 0 : 1;

                // ✅ Firebaseに更新
                db.ref("goodCounts").child(id).set(newCount).then(() => {
                    if (newCount === 1) {
                        button.querySelector(".goodmark-image").src = "グッドマーク_緑.png";
                        button.classList.add("clicked");

                        // ポップアップ表示
                        let rect = this.getBoundingClientRect();
                        let scrollTop = window.scrollY || document.documentElement.scrollTop;

                        messagePopup.style.display = "none";
                        setTimeout(() => {
                            messagePopup.style.left = (rect.left + window.scrollX - 30) + "px";
                            messagePopup.style.top = (rect.top + scrollTop - messagePopup.offsetHeight - 10) + "px";
                            messagePopup.style.display = "block";
                        }, 0);
                        currentGoodId = id;
                    } else {
                        button.querySelector(".goodmark-image").src = "グッドマーク.png";
                        button.classList.remove("clicked");
                        messagePopup.style.display = "none";
                    }
                });
            });
        });
    });

    // ✅ バツボタンでポップアップを閉じる
    closePopup.addEventListener("click", function () {
        messagePopup.style.display = "none";
    });

    // ✅ パネルをシャッフル
    const container = document.querySelector(".panel-container");
    if (container) {
        const panels = Array.from(container.children);
        if (panels.length > 0) {
            panels.sort(() => Math.random() - 0.5);
            panels.forEach(panel => container.appendChild(panel));
        }
    }

    // ✅ メッセージを送信（Firebaseに保存）
    sendMessage.addEventListener("click", function () {
        let message = messageInput.value.trim();
        if (message === "" || currentGoodId === null) return;

        db.ref("messages").push({
            goodId: currentGoodId,
            text: message
        }).then(() => {
            messagePopup.style.display = "none";
            messageInput.value = "";

            // 感謝メッセージ表示
            let goodButton = document.querySelector(`.goodmark-button[data-id="${currentGoodId}"]`);
            let thankYouMessage = document.createElement("p");
            thankYouMessage.textContent = "メッセージが届きました！";
            thankYouMessage.classList.add("thank-you-message");
            goodButton.appendChild(thankYouMessage);

            setTimeout(() => {
                thankYouMessage.remove();
            }, 3000);
        }).catch(error => {
            console.error("メッセージの送信に失敗:", error);
        });
    });
});

function getGoodCounts() {
    db.ref("goodCounts").once("value").then(snapshot => {
        const goodData = snapshot.val() || {};
        console.log("グッド数:", goodData);
    }).catch(error => {
        console.error("グッド数の取得に失敗:", error);
    });
}

getGoodCounts();
