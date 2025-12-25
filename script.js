document.getElementById('runBtn').addEventListener('click', async function() {
    const serverId = document.getElementById('serverId').value;
    const msgUrl = document.getElementById('messageUrl').value;
    const btn = this;
    const logContainer = document.getElementById('logContainer');
    const statusLog = document.getElementById('statusLog');
    const progressBar = document.getElementById('progress');

    // 簡単なバリデーション
    if (!serverId || !msgUrl) {
        alert("サーバーIDとメッセージURLを入力してください。");
        return;
    }

    // UIの初期化
    btn.disabled = true;
    btn.innerText = "処理中...";
    btn.classList.remove('active');
    logContainer.style.display = 'block';
    statusLog.innerHTML = "";
    progressBar.style.width = "0%";

    // 実行するステップのリストを作成
    const steps = [];
    if (document.getElementById('step1').checked) steps.push("リアクションを付与中...");
    if (document.getElementById('step2').checked) steps.push("認証質問に回答を送信中...");
    if (document.getElementById('step3').checked) steps.push("オンボーディング設定を適用中...");

    // シミュレーション実行
    addLog(`[INFO] サーバー ${serverId} への接続を開始します...`);
    
    for (let i = 0; i < steps.length; i++) {
        await sleep(1500); // 1.5秒待機（ネットワーク遅延の再現）
        addLog(`[PROCESS] ${steps[i]}`);
        
        let progressPercent = ((i + 1) / steps.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    await sleep(1000);
    addLog("[SUCCESS] すべてのセットアップが完了しました。");
    btn.innerText = "完了";
    btn.style.background = "#2ecc71";
});

// ログ追加関数
function addLog(message) {
    const log = document.getElementById('statusLog');
    const entry = document.createElement('div');
    entry.textContent = `> ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// 待機用ヘルパー
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
