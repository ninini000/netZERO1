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

// 匿名ユーザーID（端末ごとに保存）
const userId = localStorage.getItem("anonId") || (() => {
    const id = Math.random().toString(36).substr(2, 9);
    localStorage.setItem("anonId", id);
    return id;
})();

document.addEventListener("DOMContentLoaded", function () {
    const goodButtons = document.querySelectorAll(".goodmark-button");
    const messagePopup = document.getElementById("messagePopup");
    const closePopup = document.getElementById("closePopup");
    const sendMessage = document.getElementById("sendMessage");
    const messageInput = document.getElementById("messageInput");

    let currentGoodId = null;

    goodButtons.forEach(button => {
        let id = button.getAttribute("data-id");

        // 初期状態を取得（自分が押してるか + 総数）
        db.ref("goodCounts").child(id).once("value").then(snapshot => {
            const data = snapshot.val() || {};
            const isClicked = data[userId] === true;
            const count = Object.keys(data).length;

            updateGoodButton(button, isClicked, count);
        });

        // グッドボタンのクリック処理
        button.addEventListener("click", function () {
            const ref = db.ref("goodCounts").child(id);

            ref.once("value").then(snapshot => {
                const data = snapshot.val() || {};
                const isClicked = data[userId] === true;

                if (isClicked) {
                    ref.child(userId).remove(); // 取り消し
                } else {
                    ref.child(userId).set(true); // いいね
                }

                // 更新後の状態を取得してUI更新
                ref.once("value").then(newSnap => {
                    const newData = newSnap.val() || {};
                    const newIsClicked = newData[userId] === true;
                    const newCount = Object.keys(newData).length;

                    updateGoodButton(button, newIsClicked, newCount);

                    if (newIsClicked) {
                        showPopup(this);
                        currentGoodId = id;
                    } else {
                        messagePopup.style.display = "none";
                    }
                });
            });
        });
    });

    closePopup.addEventListener("click", function () {
        messagePopup.style.display = "none";
    });

    const container = document.querySelector(".panel-container");
    if (container) {
        const panels = Array.from(container.children);
        if (panels.length > 0) {
            panels.sort(() => Math.random() - 0.5);
            panels.forEach(panel => container.appendChild(panel));
        }
    }

    sendMessage.addEventListener("click", function () {
        let message = messageInput.value.trim();
        if (message === "" || currentGoodId === null) return;

        db.ref("messages").push({
            goodId: currentGoodId,
            text: message
        }).then(() => {
            messagePopup.style.display = "none";
            messageInput.value = "";

            const goodButton = document.querySelector(`.goodmark-button[data-id="${currentGoodId}"]`);
            const thankYouMessage = document.createElement("p");
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

function updateGoodButton(button, isClicked, count) {
    if (isClicked) {
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

function getGoodCounts() {
    db.ref("goodCounts").once("value").then(snapshot => {
        const goodData = snapshot.val() || {};
        console.log("グッド数データ:", goodData);
    }).catch(error => {
        console.error("グッド数の取得に失敗:", error);
    });
}

getGoodCounts();

