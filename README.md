[2026-06-07T10:35:00+08:00]

[影片名稱](影片網址)
[Finalterm video](https://youtu.be/PllTDWeZD2c?si=lUOWmX9jRxAn6kgs)

# ⏱️ Chronos Quest v2.0 - UTT Mobile 🚀

[![UTT-v2.0](https://img.shields.io/badge/UTT-v2.0-blue.svg)](https://github.com/PattyHsue)
[![Electron](https://img.shields.io/badge/Electron-28.2.0-47848f.svg)](https://www.electronjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### 🎮 [👉 點擊這裡立即線上遊玩 (Play Now!) 👈](https://pattyhsue.github.io/ChronosQuest/CQ_4Season_2026M4/) 🎮

歡迎來到 **Chronos Quest v2.0**！這是一個由 Universal Tutor Team (UTT-v2.0) 精心設計的「全能冒險打磚塊」遊戲 🎮。結合了流暢的 HTML5 Canvas 物理引擎、Web Audio API 過程化音樂，以及 Electron 跨平台封裝技術，為玩家帶來大師級的沉浸式體驗 ✨。

---

## 🌟 The Universal Tutor Standard Deliverable Package (v2.0)

### 🎣 Part 1: The Hook
「如果打磚塊不只是消磨時間，而是一場穿越時空、挑戰巨大 Boss 的史詩級戰役，你準備好揮動你的能量板了嗎？」 ⚔️🛡️

### 🌌 Part 2: The Grand Metaphor
Chronos Quest 就像是一座「時間的試煉塔」🏰。每一顆磚塊都是時間的碎片，而你手中的擋板則是維持宇宙平衡的能量閥。當你擊碎所有的時間碎片，守護該時空的霸主（Boss）就會現身。這不僅僅是物理碰撞的反彈，更是運算邏輯與手眼協調的完美共舞！舞動於春之庭園 🌸、盛夏海灘 ☀️、秋之落葉 🍂 與冬之雪域 ❄️ 之間，重寫四季的秩序。

### 📝 Part 3: The Summary
這款遊戲採用純 Vanilla JavaScript 開發，並封裝為 Electron 桌面應用程式 💻。
核心特色包含：
- **動態物理引擎** ⚡：流暢的球體碰撞反彈與粒子特效。
- **四大季節關卡** 🌍：春之庭園、盛夏海灘、秋之落葉、冬之雪域，各自擁有獨立的背景生態與視覺風格。
- **開發者測試面板 (Test Panel)** 🛠️：可讓開發者或測試人員快速跳轉不同季節關卡，甚至直接召喚 Boss (FORCE BOSS)！
- **史詩級 Boss 戰** 👾：當磚塊清空時，Boss 會進入彈性浮動、狂暴模式 (Rage Mode)，並擁有專屬的生命值條與多重陰影渲染。
- **過程化音樂 (Procedural Audio)** 🎵：內建 `AudioManager` 負責動態合成晶體碰撞聲與背景鋼琴和弦。

### 🗺️ Part 4: The Explorer's Map
在探索這個專案時，請思考以下三個深度問題 🧠：
1. **碰撞優化**：遊戲中的球體與磚塊碰撞，目前採用了簡單的 AABB (Axis-Aligned Bounding Box) 碰撞檢測。如果是上千個實體，該如何優化？
2. **狀態管理**：遊戲的 `SceneManager` 是如何動態切換主題並管理不同的 Canvas 繪圖狀態的？
3. **跨平台封裝**：`package.json` 中配置了 `electron-builder`，它如何將這套 Web 遊戲無縫轉換為可執行的 Windows/Mac 應用程式？

### 🎨 Part 5: The Visual Incantation
> `/imagine prompt: A futuristic paddle intercepting a glowing neon ball, shattering floating stone bricks suspended in a lush mystical forest, cinematic lighting, Unreal Engine 5 render, glowing blue and green particles, volumetric fog, masterpiece --ar 16:9 --v 6.0` 🖌️

### 🎬 Part 6: The Expedition Team
推薦進一步學習的資源 📚：
- [Canvas HTML5 遊戲開發教學](https://www.youtube.com/results?search_query=html5+canvas+game+tutorial)
- [JavaScript Game Physics](https://www.youtube.com/results?search_query=javascript+game+physics+collision)

---

## 🧠 Part 7: The Logic Blueprint (Ada)
**演算法與邏輯科學家 Ada 的嚴格審查 🔬：**
1. **碰撞檢測的時間複雜度 (Time Complexity)**：
   每一次 Frame 更新中，我們需要檢查球與所有磚塊的碰撞。
   - **時間複雜度**: $O(N)$，其中 $N$ 是目前畫面中「未被擊碎的磚塊數量」。
   - **空間複雜度**: $O(1)$，碰撞檢測只使用了少量的變數。
   - **優化建議 (QuadTree)**：若未來增加多顆球或大量障礙物，建議引入 **四叉樹 (QuadTree)** 結構，將碰撞檢測的時間複雜度優化至 $O(\log N)$。

2. **粒子系統生命週期**：
   `EffectManager` 使用了 Array 來管理爆炸的粒子，並且使用反向迴圈 (Reverse For-Loop Splice Rule) 或在更新時 `filter` 移除死去的粒子，這有效防止了記憶體外洩 (Memory Leaks) 🗑️。

---

## ⚙️ Part 8: The Engineering Standard (Xavier)
**首席系統與軟體架構師 Xavier 的架構審查 🏗️：**
本專案嚴格遵循 **Clean Code (整潔程式碼)** 與 **SOLID 原則**：
- **單一職責原則 (Single Responsibility Principle)**：
  我們將程式碼拆分為高內聚的模組。`AudioManager` 只負責聲音的合成與播放 🎶；`EffectManager` 只負責背景生物與粒子特效的渲染 ✨；`SceneManager` 處理關卡資料與場景設定 🖼️；`Game` 類別則負責核心的遊戲迴圈與物理邏輯 🕹️。
- **依賴反轉 (Dependency Inversion)**：
  各個 Manager 在 `Game` 建構子中被實例化，並將 `canvas` 與 `ctx` 作為參數傳入，確保了渲染環境的解耦。

---

## 🛠️ 安裝與執行說明 (Installation)

### 1. 取得程式碼
```bash
git clone https://github.com/PattyHsue/ChronosQuest.git
cd ChronosQuest
```

### 2. 安裝依賴 (Install Dependencies)
請確保您已安裝 Node.js (>= 16)。
```bash
npm install
```

### 3. 本地執行 (Run Application)
啟動 Electron 開發環境 🚀：
```bash
npm start
```

### 4. 打包應用程式 (Build for Production)
若要打包成可執行的桌面端應用程式 (Portable 格式)：
```bash
npm run build
```

---
*Built with ❤️ by The Universal Tutor Team v2.0*
