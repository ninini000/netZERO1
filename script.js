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
        button.addEventListener("click", function () {
            let currentCount = localStorage.getItem("goodCount_" + id); // 文字列のまま取得

            if (this.classList.contains("clicked")) {
                // ✅ いいね取り消し
                localStorage.setItem("goodCount_" + id, "0");
                this.querySelector(".goodmark-image").src = "グッドマーク.png";
                this.classList.remove("clicked");
                messagePopup.style.display = "none"; // ポップアップを非表示にする
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

        let storedMessages = JSON.parse(localStorage.getItem("messages_" + currentGoodId)) || [];
        storedMessages.push(message);
        localStorage.setItem("messages_" + currentGoodId, JSON.stringify(storedMessages));

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
