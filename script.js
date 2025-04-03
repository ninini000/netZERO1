document.addEventListener("DOMContentLoaded", function() {
    const goodButtons = document.querySelectorAll(".goodmark-image");
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
            button.src = "グッドマーク_緑.png";
            button.classList.add("clicked");
        } else {
            button.src = "グッドマーク.png"; // 初期状態の白いボタン
            button.classList.remove("clicked");
        }

        // ✅ グッドボタンのクリックイベント
        button.addEventListener("click", function(event) {
            event.stopPropagation(); // イベントの伝播を停止
            let currentCount = localStorage.getItem("goodCount_" + id); // 文字列のまま取得

            if (this.classList.contains("clicked")) {
                // ✅ いいね取り消し
                localStorage.setItem("goodCount_" + id, "0");
                this.src = "グッドマーク.png";
                this.classList.remove("clicked");
                messagePopup.style.display = "none";
            } else {
                // ✅ いいね付与
                localStorage.setItem("goodCount_" + id, "1");
                this.src = "グッドマーク_緑.png";
                this.classList.add("clicked");

                // ✅ 押したボタンの上にポップアップを表示
                let rect = event.target.getBoundingClientRect();
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
    closePopup.addEventListener("click", function() {
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
    sendMessage.addEventListener("click", function() {
        let message = messageInput.value.trim();
        if (message === "") return;

        let storedMessages = JSON.parse(localStorage.getItem("messages_" + currentGoodId)) || [];
        storedMessages.push(message);
        localStorage.setItem("messages_" + currentGoodId, JSON.stringify(storedMessages));

        messagePopup.style.display = "none";
        messageInput.value = "";

        // ✅ 感謝メッセージを表示
        let goodButton = document.querySelector(`.goodmark-image[data-id="${currentGoodId}"]`);
        let thankYouMessage = document.createElement("p");
        thankYouMessage.textContent = "メッセージが届きました！";
        thankYouMessage.classList.add("thank-you-message");
        goodButton.parentNode.appendChild(thankYouMessage);

        setTimeout(() => {
            thankYouMessage.remove();
        }, 3000);
    });

    document.querySelectorAll(".goodmark-image").forEach(button => {
        button.addEventListener("click", function(event) {
            if (this.classList.contains("clicked")) {
                return; // ✅ いいね取り消し時にはポップアップを表示しない
            }

            let popup = document.querySelector(".popup");

            // 画面中央にポップアップを表示する
            popup.style.left = "50%";
            popup.style.top = "50%";
            popup.style.transform = "translate(-63%, -80%)"; // 中央揃えのための変換

            popup.style.visibility = "visible"; // ポップアップを表示
            popup.style.display = "block"; // ポップアップを表示
        });
    });

    // バツボタンを押したらポップアップを閉じる
    document.querySelector(".close-btn").addEventListener("click", function() {
        document.querySelector(".popup").style.display = "none";
    });
});
