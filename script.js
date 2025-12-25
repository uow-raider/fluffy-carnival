document.getElementById('runBtn').addEventListener('click', async function() {
    const token = document.getElementById('token').value.trim();
    const msgUrl = document.getElementById('messageUrl').value.trim();
    const btn = this;
    const logArea = document.getElementById('statusLog');
    const logContainer = document.getElementById('logContainer');
    const progressBar = document.getElementById('progress');

    if (!token || !msgUrl) {
        alert("トークンとURLを入力してください。");
        return;
    }

    // URL解析: https://discord.com/channels/[ServerID]/[ChannelID]/[MessageID]
    const parts = msgUrl.split('/');
    if (parts.length < 3) {
        alert("メッセージURLの形式が正しくありません。");
        return;
    }
    const messageId = parts.pop();
    const channelId = parts.pop();

    // UI初期化
    btn.disabled = true;
    btn.innerText = "実行中...";
    logContainer.style.display = 'block';
    logArea.innerHTML = "";
    progressBar.style.width = "0%";

    const addLog = (msg, isError = false) => {
        const div = document.createElement('div');
        div.style.color = isError ? "#ff4d4d" : "#00ff00";
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logArea.appendChild(div);
        logArea.scrollTop = logArea.scrollHeight;
    };

    try {
        // --- STEP 1: リアクション ---
        if (document.getElementById('step1').checked) {
            addLog("リアクションを送信中...");
            const emoji = encodeURIComponent("✅");
            const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, {
                method: "PUT",
                headers: { "Authorization": token }
            });

            if (res.status === 204) {
                addLog("成功: リアクションを付与しました。");
            } else {
                addLog(`失敗: ステータスコード ${res.status}`, true);
            }
            progressBar.style.width = "50%";
            await new Promise(r => setTimeout(r, 1000));
        }

        // --- STEP 2: メッセージ送信 ---
        if (document.getElementById('step2').checked) {
            addLog("認証メッセージを送信中...");
            const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: "完了しました。" })
            });

            if (res.ok) {
                addLog("成功: メッセージを送信しました。");
            } else {
                addLog(`失敗: ステータスコード ${res.status}`, true);
            }
            progressBar.style.width = "100%";
        }

        addLog("すべてのタスクが終了しました。");
        btn.innerText = "完了";
        btn.style.background = "#2ecc71";

    } catch (err) {
        addLog(`致命的なエラー: ${err.message}`, true);
        btn.disabled = false;
        btn.innerText = "再試行";
    }
});
