document.addEventListener("DOMContentLoaded", function() {
    let goodList = document.getElementById("good-list");

    for (let i = 1; i <= 10; i++) { // 作品の数（適宜変更）
        let storedCount = localStorage.getItem("goodCount_" + i) || 0;

        let listItem = document.createElement("li");
        listItem.textContent = `作品${i} のグッド数: ${storedCount}`;
        goodList.appendChild(listItem);
    }
});
document.addEventListener("DOMContentLoaded", function() {
    let messageList = document.getElementById("message-list");

    for (let i = 1; i <= 10; i++) {
        let storedMessages = JSON.parse(localStorage.getItem("messages_" + i)) || [];

        if (storedMessages.length > 0) {
            let listItem = document.createElement("li");
            listItem.textContent = `作品${i} のメッセージ: ${storedMessages.join(", ")}`;
            messageList.appendChild(listItem);
        }
    }
});
