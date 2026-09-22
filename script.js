/* =========================================================
   詐欺メッセージ復元パズル
========================================================= */

let questions = [];
let currentQuestion = 0;
let score = 0;
let selectedParts = [];
let answered = false;

const gameScreen =
  document.getElementById("gameScreen");

const resultScreen =
  document.getElementById("resultScreen");

const answerArea =
  document.getElementById("answerArea");

const partsArea =
  document.getElementById("partsArea");

const feedback =
  document.getElementById("feedback");

const progressText =
  document.getElementById("progressText");

const progressFill =
  document.getElementById("progressFill");

const finalScore =
  document.getElementById("finalScore");

const resultMessage =
  document.getElementById("resultMessage");

const restartButton =
  document.getElementById("restartButton");

const resetButton =
  document.getElementById("resetButton");


/* =========================================================
   問題データ
========================================================= */

const allQuestions = [
  {
    parts: [
      "あなたの口座に異常が確認されました。",
      "安全確認のため、",
      "下記のリンクからログインしてください。",
      "確認しない場合、アカウントを停止する可能性があります。"
    ],
    explanation:
      "緊急性をあおってリンク先へのログインを求めるメッセージは要注意です。公式サイトや公式アプリから確認しましょう。"
  },

  {
    parts: [
      "お客様のお荷物をお届けできませんでした。",
      "再配達の手続きが必要です。",
      "下記リンクから住所を確認してください。"
    ],
    explanation:
      "突然届いた配送通知からリンクへ誘導し、住所などの個人情報を入力させようとする手口に注意しましょう。"
  },

  {
    parts: [
      "あなたに還付金があります。",
      "本日中に手続きを行う必要があります。",
      "ATMへ行き、担当者の指示に従ってください。"
    ],
    explanation:
      "還付金を受け取るためにATMを操作するよう求めるのは、典型的な詐欺の手口です。"
  },

  {
    parts: [
      "おめでとうございます！",
      "あなたは豪華賞品に当選しました。",
      "賞品受け取りのため、",
      "下記リンクから手続きをしてください。"
    ],
    explanation:
      "応募した覚えのない当選通知からリンクへ誘導するメッセージには注意しましょう。"
  },

  {
    parts: [
      "この投資なら絶対に儲かります。",
      "私も実際に大きな利益が出ました。",
      "興味があれば、",
      "指定のアカウントに送金してください。"
    ],
    explanation:
      "「絶対に儲かる」など利益を保証し、送金を求める話には注意が必要です。"
  },

  {
    parts: [
      "ご利用料金が未払いとなっています。",
      "本日中に支払いがない場合、",
      "法的手続きを開始します。",
      "至急、下記の番号へご連絡ください。"
    ],
    explanation:
      "「本日中」「法的手続き」などと不安をあおり、急いで連絡させようとするメッセージには注意しましょう。"
  },

  {
    parts: [
      "お支払い情報に問題が発生しました。",
      "24時間以内に",
      "カード情報を更新してください。",
      "対応しない場合、注文をキャンセルします。"
    ],
    explanation:
      "時間制限を設けてカード情報などを入力させようとするメッセージは要注意です。"
  },

  {
    parts: [
      "あなたの口座が犯罪に利用されています。",
      "確認のため、",
      "指定された口座へ資金を移してください。",
      "この件は他人に話してはいけません。"
    ],
    explanation:
      "警察などを名乗ってお金を移すよう要求するメッセージには注意が必要です。"
  },

  {
    parts: [
      "お荷物のお届けに必要な住所情報が不足しています。",
      "下記ページから",
      "住所と電話番号を入力してください。",
      "入力がない場合、お荷物を返送します。"
    ],
    explanation:
      "配送を理由に住所や電話番号などの個人情報を入力させるメッセージには注意しましょう。"
  },

  {
    parts: [
      "今だけ参加できる特別案件です。",
      "必ず利益が出る限定情報を入手しました。",
      "少額から始められます。",
      "今すぐ参加してください。"
    ],
    explanation:
      "「必ず利益が出る」「今だけ」など、利益を保証したり急がせたりする話は要注意です。"
  }
];


/* =========================================================
   シャッフル
========================================================= */

function shuffle(array) {
  const copy = [...array];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [copy[i], copy[j]] =
      [copy[j], copy[i]];
  }

  return copy;
}


/* =========================================================
   ゲーム開始
========================================================= */

function startGame() {
  questions =
    shuffle(allQuestions).slice(0, 5);

  currentQuestion = 0;
  score = 0;
  selectedParts = [];
  answered = false;

  gameScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");

  showQuestion();
}


/* =========================================================
   問題表示
========================================================= */

function showQuestion() {
  const question =
    questions[currentQuestion];

  selectedParts = [];
  answered = false;

  progressText.innerText =
    `${currentQuestion + 1} / 5`;

  progressFill.style.width =
    `${((currentQuestion + 1) / 5) * 100}%`;


  /* 復元エリアを初期化 */

  answerArea.innerHTML =
    `
      <div class="answer-placeholder">
        ここにメッセージが復元されます
      </div>
    `;


  /* ピースをシャッフル */

  const shuffledParts =
    shuffle(question.parts);

  partsArea.innerHTML = "";


  shuffledParts.forEach(
    (part) => {

      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "part-button";
      button.innerText = part;

      button.dataset.part =
        part;


      button.addEventListener(
        "click",
        () => {

          selectPart(
            part,
            button
          );

        }
      );


      partsArea.appendChild(
        button
      );
    }
  );

feedback.innerHTML = "";
feedback.classList.remove("show");
}


/* =========================================================
   ピースを選択
========================================================= */

function selectPart(part, button) {

  if (answered) return;


  /* すでに選択されている場合は何もしない */

  if (
    selectedParts.includes(part)
  ) {
    return;
  }


  /* 選択リストに追加 */

  selectedParts.push(part);

  button.classList.add("used");


  /* プレースホルダーを削除 */

  const placeholder =
    answerArea.querySelector(
      ".answer-placeholder"
    );

  if (placeholder) {
    placeholder.remove();
  }


  /* 復元エリアにピースを作成 */

  const answerPart =
    document.createElement("button");

  answerPart.type = "button";

  answerPart.className =
    "answer-part";

  answerPart.innerText =
    part;

  answerPart.dataset.part =
    part;


  /* -----------------------------------------
     復元エリアのピースを押したら
     そのピースだけ外す
  ----------------------------------------- */

  answerPart.addEventListener(
    "click",
    () => {

      removePart(
        part,
        answerPart
      );

    }
  );


  answerArea.appendChild(
    answerPart
  );


  /* 全部選択したら自動判定 */

  const question =
    questions[currentQuestion];

  if (
    selectedParts.length ===
    question.parts.length
  ) {
    checkAnswer();
  }
}


/* =========================================================
   復元エリアからピースを外す
========================================================= */

function removePart(
  part,
  answerPart
) {

  if (answered) return;


  /* selectedPartsから削除 */

  const index =
    selectedParts.indexOf(part);

  if (index !== -1) {

    selectedParts.splice(
      index,
      1
    );
  }


  /* 復元エリアから削除 */

  answerPart.remove();


  /* 元のピースを未選択状態に戻す */

  const buttons =
    partsArea.querySelectorAll(
      ".part-button"
    );

  buttons.forEach(
    button => {

      if (
        button.dataset.part === part
      ) {

        button.classList.remove(
          "used"
        );

      }

    }
  );


  /* 全部外した場合 */

  if (
    selectedParts.length === 0
  ) {

    answerArea.innerHTML =
      `
        <div class="answer-placeholder">
          ここにメッセージが復元されます
        </div>
      `;
  }
}


/* =========================================================
   全部リセット
========================================================= */

function resetPuzzle() {

  if (answered) return;

  selectedParts = [];


  /* 復元エリアを空にする */

  answerArea.innerHTML =
    `
      <div class="answer-placeholder">
        ここにメッセージが復元されます
      </div>
    `;


  /* 全ピースを未選択に戻す */

  const buttons =
    partsArea.querySelectorAll(
      ".part-button"
    );

  buttons.forEach(
    button => {

      button.classList.remove(
        "used"
      );

    }
  );


  /* メッセージを消す */

  feedback.innerHTML = "";
}


/* =========================================================
   正解判定
========================================================= */

function checkAnswer() {

  answered = true;

  const question =
    questions[currentQuestion];


  const correct =
    selectedParts.every(
      (part, index) =>
        part === question.parts[index]
    );


  /* 正解 */

  if (correct) {

    score += 20;

    feedback.innerHTML =
      `
        <strong>🎉 正解！</strong>
        <br><br>
        ${question.explanation}
      `;
  }


  /* 不正解 */

  else {

    feedback.innerHTML =
      `
        <strong>❌ 不正解</strong>
        <br><br>
        正しい順番は、
        「最初に状況 → 次に要求 → 最後に行動」
        という流れになっています。
        <br><br>
        ${question.explanation}
      `;
  }


  /* 次の問題ボタン */

  const nextButton =
    document.createElement("button");

  nextButton.type = "button";

  nextButton.className =
    "main-btn";

  nextButton.innerText =
    currentQuestion === 4
      ? "結果を見る"
      : "次の問題へ";


  nextButton.addEventListener(
    "click",
    nextQuestion
  );


  feedback.appendChild(
    nextButton
  );
   feedback.classList.add("show");
}


/* =========================================================
   次の問題
========================================================= */

function nextQuestion() {

  currentQuestion++;


  if (
    currentQuestion >= 5
  ) {

    showResult();

    return;
  }


  showQuestion();
}


/* =========================================================
   結果表示
========================================================= */

function showResult() {

  gameScreen.classList.add(
    "hidden"
  );

  resultScreen.classList.remove(
    "hidden"
  );


  finalScore.innerText =
    `${score} / 100`;


  if (score === 100) {

    resultMessage.innerText =
      "全問正解！\n" +
      "詐欺メッセージの流れをしっかり見抜けました。";
  }

  else if (score >= 60) {

    resultMessage.innerText =
      "よくできました！\n" +
      "怪しいメッセージが届いたときは、落ち着いて内容を確認しましょう。";
  }

  else {

    resultMessage.innerText =
      "もう一度挑戦してみましょう！\n" +
      "知らない相手からのメッセージは、すぐに信じず確認することが大切です。";
  }
}


/* =========================================================
   ボタンイベント
========================================================= */

restartButton.addEventListener(
  "click",
  startGame
);

resetButton.addEventListener(
  "click",
  resetPuzzle
);


/* =========================================================
   ゲーム開始
========================================================= */

startGame();
