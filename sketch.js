
/*
  多媒體英文單字闖關測驗
  適用對象：國小學生
  開發工具：p5.js
  功能：圖片、語音、選擇題、即時回饋、星星獎勵
*/

// ================================
// 一、題庫設定
// ================================

let questionBank = [
  { word: "Apple", meaning: "蘋果", emoji: "🍎" },
  { word: "Cat", meaning: "貓", emoji: "🐱" },
  { word: "Dog", meaning: "狗", emoji: "🐶" },
  { word: "Fish", meaning: "魚", emoji: "🐟" },
  { word: "Bird", meaning: "鳥", emoji: "🐦" },
  { word: "Rabbit", meaning: "兔子", emoji: "🐰" },
  { word: "Banana", meaning: "香蕉", emoji: "🍌" },
  { word: "Elephant", meaning: "大象", emoji: "🐘" },
  { word: "Cake", meaning: "蛋糕", emoji: "🍰" },
  { word: "Car", meaning: "汽車", emoji: "🚗" }
];

// ================================
// 二、遊戲變數
// ================================

let questions = [];
let currentQuestion = 0;
let score = 0;

let answered = false;
let selectedAnswer = "";
let gameState = "start";

// 按鈕位置紀錄
let buttons = [];

// ================================
// 三、畫面初始化
// ================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  startGame();
}

// 畫面大小隨視窗調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ================================
// 四、開始遊戲
// ================================

function startGame() {

  // 隨機抽取五題
  questions = shuffle([...questionBank]).slice(0, 5);

  currentQuestion = 0;
  score = 0;

  answered = false;
  selectedAnswer = "";

  gameState = "start";
  buttons = [];
}

// ================================
// 五、繪製背景
// ================================

function draw() {

  background(230, 242, 255);

  // 背景裝飾
  noStroke();
  fill(255, 255, 255, 100);

  circle(width * 0.1, height * 0.15, 80);
  circle(width * 0.9, height * 0.2, 110);
  circle(width * 0.85, height * 0.85, 70);

  buttons = [];

  if (gameState === "start") {
    drawStartScreen();
  }

  else if (gameState === "quiz") {
    drawQuizScreen();
  }

  else if (gameState === "result") {
    drawResultScreen();
  }
}

// ================================
// 六、開始畫面
// ================================

function drawStartScreen() {

  let cx = width / 2;

  drawCard(cx, height / 2, min(width - 30, 650), min(height - 30, 540));

  fill(70, 100, 170);
  textSize(min(width * 0.08, 42));
  text("🌈 英文單字冒險島", cx, height * 0.30);

  fill(90);
  textSize(20);
  text("一起挑戰英文單字吧！", cx, height * 0.42);

  textSize(55);
  text("🍎 🐱 🐶", cx, height * 0.54);

  textSize(17);
  fill(100);
  text("答對題目就能獲得星星！", cx, height * 0.65);

  drawButton(
    "開始冒險！ 🚀",
    cx - 110,
    height * 0.73,
    220,
    60,
    color(80, 170, 240),
    "start"
  );
}

// ================================
// 七、測驗畫面
// ================================

function drawQuizScreen() {

  let cx = width / 2;
  let cardW = min(width - 24, 680);
  let cardH = min(height - 24, 680);

  drawCard(cx, height / 2, cardW, cardH);

  let q = questions[currentQuestion];

  // 題數
  fill(80, 110, 170);
  textSize(18);
  text(
    "第 " + (currentQuestion + 1) + " / 5 題",
    cx,
    height * 0.09
  );

  // 進度條
  fill(220);
  rect(cx - 130, height * 0.13, 260, 12, 10);

  fill(80, 180, 230);
  rect(
    cx - 130,
    height * 0.13,
    260 * ((currentQuestion + 1) / 5),
    12,
    10
  );

  // 題目
  fill(60, 90, 150);
  textSize(min(width * 0.055, 27));
  text("請找出正確的英文單字！", cx, height * 0.21);

  // 顯示圖片
  textSize(min(width * 0.16, 85));
  text(q.emoji, cx, height * 0.34);

  // 中文提示
  fill(70);
  textSize(22);
  text("這是：" + q.meaning, cx, height * 0.43);

  // 播放語音按鈕
  drawButton(
    "🔊 聽聽看",
    cx - 85,
    height * 0.49,
    170,
    45,
    color(120, 190, 240),
    "audio"
  );

  // 四個答案選項
  let options = q.options;

  let optionW = min(cardW * 0.78, 390);
  let optionH = 48;
  let startY = height * 0.57;

  for (let i = 0; i < options.length; i++) {

    let y = startY + i * 55;

    let btnColor = color(245, 248, 255);

    // 答題後顯示顏色
    if (answered) {

      if (options[i] === q.word) {
        btnColor = color(140, 225, 160);
      }

      else if (options[i] === selectedAnswer) {
        btnColor = color(255, 160, 160);
      }
    }

    drawButton(
      options[i],
      cx - optionW / 2,
      y,
      optionW,
      optionH,
      btnColor,
      "answer",
      options[i]
    );
  }

  // 答題回饋
  if (answered) {

    let feedbackY = min(height * 0.91, height - 45);

    if (selectedAnswer === q.word) {

      fill(30, 160, 80);
      textSize(19);
      text("🎉 太棒了！答對了！", cx, feedbackY);

    } else {

      fill(220, 70, 70);
      textSize(17);
      text(
        "再記一次：" + q.word + " = " + q.meaning,
        cx,
        feedbackY
      );
    }

    // 下一題
    drawButton(
      currentQuestion === 4 ? "查看成績 🏆" : "下一題 ➜",
      cx - 105,
      height - 35,
      210,
      55,
      color(80, 170, 240),
      "next"
    );
  }
}

// ================================
// 八、準備每一題的選項
// ================================

function prepareQuestions() {

  for (let q of questions) {

    // 隨機抽出三個錯誤答案
    let wrongAnswers = shuffle(
      questionBank
        .filter(item => item.word !== q.word)
    ).slice(0, 3);

    // 正確答案加上三個錯誤答案
    q.options = shuffle([
      q.word,
      ...wrongAnswers.map(item => item.word)
    ]);
  }
}

// ================================
// 九、繪製成績畫面
// ================================

function drawResultScreen() {

  let cx = width / 2;

  drawCard(
    cx,
    height / 2,
    min(width - 30, 650),
    min(height - 30, 540)
  );

  fill(70, 100, 170);
  textSize(36);
  text("🏆 挑戰完成！", cx, height * 0.27);

  fill(255, 180, 30);
  textSize(55);

  // 根據分數顯示星星
  let stars = "⭐".repeat(score);

  text(stars || "🌱", cx, height * 0.40);

  fill(70);
  textSize(25);
  text("你的成績是", cx, height * 0.53);

  fill(60, 130, 210);
  textSize(45);
  text(score + " / 5 分", cx, height * 0.63);

  fill(80);
  textSize(19);

  if (score === 5) {
    text("太厲害了！你是英文小高手！", cx, height * 0.72);
  }

  else if (score >= 3) {
    text("表現不錯！繼續加油！", cx, height * 0.72);
  }

  else {
    text("沒關係，再練習一次就會更好！", cx, height * 0.72);
  }

  drawButton(
    "再玩一次 🔄",
    cx - 110,
    height * 0.81,
    220,
    55,
    color(80, 170, 240),
    "restart"
  );
}

// ================================
// 十、卡片設計
// ================================

function drawCard(cx, cy, w, h) {

  rectMode(CENTER);
  noStroke();

  fill(255);
  rect(cx, cy, w, h, 28);

  rectMode(CORNER);
}

// ================================
// 十一、按鈕設計
// ================================

function drawButton(label, x, y, w, h, btnColor, type, value = "") {

  rectMode(CORNER);

  noStroke();
  fill(0, 0, 0, 20);
  rect(x, y + 4, w, h, 15);

  fill(btnColor);
  rect(x, y, w, h, 15);

  fill(50);
  textSize(19);
  text(label, x + w / 2, y + h / 2);

  // 記錄按鈕位置，讓滑鼠可以點擊
  buttons.push({
    x: x,
    y: y,
    w: w,
    h: h,
    type: type,
    value: value
  });

  rectMode(CORNER);
}

// ================================
// 十二、滑鼠點擊事件
// ================================

function mousePressed() {

  for (let btn of buttons) {

    // 判斷滑鼠是否點擊按鈕
    if (
      mouseX >= btn.x &&
      mouseX <= btn.x + btn.w &&
      mouseY >= btn.y &&
      mouseY <= btn.y + btn.h
    ) {

      handleButton(btn);
      break;
    }
  }
}

// ================================
// 十三、按鈕功能
// ================================

function handleButton(btn) {

  // 開始遊戲
  if (btn.type === "start") {

    gameState = "quiz";
    prepareQuestions();
  }

  // 播放英文發音
  else if (btn.type === "audio") {

    speakWord(questions[currentQuestion].word);
  }

  // 選擇答案
  else if (btn.type === "answer") {

    if (!answered) {

      answered = true;
      selectedAnswer = btn.value;

      if (selectedAnswer === questions[currentQuestion].word) {
        score++;
      }
    }
  }

  // 下一題
  else if (btn.type === "next") {

    if (!answered) return;

    if (currentQuestion < 4) {

      currentQuestion++;
      answered = false;
      selectedAnswer = "";

    } else {

      gameState = "result";
    }
  }

  // 重新開始
  else if (btn.type === "restart") {

    startGame();
  }
}

// ================================
// 十四、英文語音功能
// ================================

function speakWord(word) {

  // 確認瀏覽器支援語音
  if (!("speechSynthesis" in window)) {
    return;
  }

  // 停止上一段語音
  window.speechSynthesis.cancel();

  // 建立語音內容
  let speech = new SpeechSynthesisUtterance(word);

  // 設定英文語言
  speech.lang = "en-US";

  // 語速
  speech.rate = 0.8;

  // 音調
  speech.pitch = 1;

  // 播放語音
  window.speechSynthesis.speak(speech);
}
