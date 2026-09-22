// 화면 전환과 퀴즈 진행을 담당하는 스크립트. 문항 내용은 data.js 에서 관리합니다.

const RECOMMENDED_MIN = 6;
const RECOMMENDED_MAX = 8;

const state = {
  selectedTopicIds: [],
  queue: [], // 현재 회차에서 풀 문항 목록 (섞인 상태)
  results: [], // { question, correct }
  currentIndex: 0,
  answered: false,
  bigText: false,
  speechOn: true
};

const screens = {
  start: document.getElementById("screen-start"),
  topics: document.getElementById("screen-topics"),
  info: document.getElementById("screen-info"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result")
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

// Fisher-Yates 셔플: 매번 새로운 순서를 만들어 다시 풀 때마다 문항/선택지 순서가 바뀌게 합니다.
function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function speak(text) {
  if (!state.speechOn) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

function toggleBigText() {
  state.bigText = !state.bigText;
  document.body.classList.toggle("big-text", state.bigText);
  document.getElementById("btn-big-text").setAttribute("aria-pressed", String(state.bigText));
}

function toggleSpeech() {
  state.speechOn = !state.speechOn;
  document.getElementById("btn-speech").setAttribute("aria-pressed", String(state.speechOn));
  if (!state.speechOn && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// ---------- 시작 화면 ----------
document.getElementById("btn-class-quiz").addEventListener("click", () => openTopicSelect());
document.getElementById("btn-solo-quiz").addEventListener("click", () => openTopicSelect());
document.getElementById("btn-big-text").addEventListener("click", toggleBigText);
document.getElementById("btn-speech").addEventListener("click", toggleSpeech);

// ---------- 주제 선택 화면 ----------
// 카드를 누르면 곧바로 다음 화면(연습 안내)으로 넘어갑니다. 별도의 "다음" 버튼 확인이 필요 없습니다.
function openTopicSelect() {
  state.selectedTopicIds = [];
  renderTopicCards();
  showScreen("topics");
}

function chooseTopics(topicIds) {
  state.selectedTopicIds = topicIds;
  openInfoScreen();
}

function renderTopicCards() {
  const container = document.getElementById("topic-list");
  container.innerHTML = "";

  const allCard = document.createElement("button");
  allCard.type = "button";
  allCard.className = "topic-card topic-card--all";
  allCard.innerHTML = `<span class="topic-emoji">🗂️</span><span class="topic-name">전체 복습</span><span class="topic-count">${TOPICS.reduce((n, t) => n + t.questions.length, 0)}문항</span>`;
  allCard.addEventListener("click", () => chooseTopics(TOPICS.map((t) => t.id)));
  container.appendChild(allCard);

  TOPICS.forEach((topic) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "topic-card";
    card.innerHTML = `<span class="topic-emoji">${topic.emoji}</span><span class="topic-name">${topic.name}</span><span class="topic-count">${topic.questions.length}문항</span>`;
    card.addEventListener("click", () => chooseTopics([topic.id]));
    container.appendChild(card);
  });
}

document.getElementById("btn-topics-back").addEventListener("click", () => showScreen("start"));

// ---------- 연습 안내 화면 ----------
function buildQueueFromSelectedTopics() {
  const pool = TOPICS.filter((t) => state.selectedTopicIds.includes(t.id)).flatMap((t) =>
    t.questions.map((q) => ({ ...q, topicName: t.name }))
  );
  const shuffledPool = shuffle(pool);
  let picked = shuffledPool;
  if (shuffledPool.length > RECOMMENDED_MAX) {
    const span = RECOMMENDED_MAX - RECOMMENDED_MIN + 1;
    const count = RECOMMENDED_MIN + Math.floor(Math.random() * span);
    picked = shuffledPool.slice(0, count);
  }
  // 선택지 순서도 매번 새로 섞는다.
  return picked.map((q) => ({ ...q, choices: shuffle(q.choices) }));
}

function openInfoScreen() {
  state.queue = buildQueueFromSelectedTopics();
  const n = state.queue.length;
  const minutes = Math.max(1, Math.round((n * 1.5)));
  document.getElementById("info-topic-names").textContent = state.selectedTopicIds.length === TOPICS.length
    ? "전체 복습"
    : TOPICS.filter((t) => state.selectedTopicIds.includes(t.id)).map((t) => t.name).join(", ");
  document.getElementById("info-count").textContent = `${n}문항 · 약 ${minutes}분`;
  showScreen("info");
}

document.getElementById("btn-info-back").addEventListener("click", () => showScreen("topics"));
document.getElementById("btn-info-start").addEventListener("click", () => startQuiz());

// ---------- 퀴즈 화면 ----------
function startQuiz() {
  state.currentIndex = 0;
  state.results = [];
  renderQuestion();
  showScreen("quiz");
}

function currentQuestion() {
  return state.queue[state.currentIndex];
}

function renderQuestion() {
  state.answered = false;
  const q = currentQuestion();
  const total = state.queue.length;

  document.getElementById("quiz-progress-text").textContent = `${state.currentIndex + 1} / ${total}`;
  document.getElementById("quiz-progress-bar").style.width = `${((state.currentIndex) / total) * 100}%`;
  document.getElementById("quiz-topic-tag").textContent = q.topicName;

  const situationEl = document.getElementById("quiz-situation");
  if (q.situation) {
    situationEl.textContent = q.situation;
    situationEl.hidden = false;
  } else {
    situationEl.hidden = true;
  }

  document.getElementById("quiz-prompt").textContent = q.prompt;

  const choicesEl = document.getElementById("quiz-choices");
  choicesEl.innerHTML = "";
  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => selectChoice(choice, btn));
    choicesEl.appendChild(btn);
  });

  document.getElementById("quiz-feedback").hidden = true;
  document.getElementById("btn-quiz-next").hidden = true;

  const readText = (q.situation ? q.situation + ". " : "") + q.prompt + ". " + q.choices.map((c, i) => `${i + 1}번, ${c.text}`).join(". ");
  speak(readText);
}

function selectChoice(choice, btnEl) {
  if (state.answered) return;
  state.answered = true;

  const q = currentQuestion();
  const allBtns = document.querySelectorAll("#quiz-choices .choice-btn");
  allBtns.forEach((b) => (b.disabled = true));

  allBtns.forEach((b) => {
    const matches = q.choices.find((c) => c.text === b.textContent);
    if (matches && matches.correct) b.classList.add("choice-correct");
  });
  if (!choice.correct) btnEl.classList.add("choice-wrong");

  state.results.push({ question: q, correct: choice.correct });

  const feedback = document.getElementById("quiz-feedback");
  feedback.hidden = false;
  feedback.className = "feedback " + (choice.correct ? "feedback-correct" : "feedback-retry");
  feedback.innerHTML = `
    <div class="feedback-title">${choice.correct ? "✅ 안전한 선택이에요" : "🔄 한 번 더 확인해 볼까요?"}</div>
    <div class="feedback-explain">${q.explain}</div>
  `;
  speak((choice.correct ? "안전한 선택이에요. " : "한 번 더 확인해 볼까요? ") + q.explain);

  const nextBtn = document.getElementById("btn-quiz-next");
  nextBtn.hidden = false;
  nextBtn.textContent = state.currentIndex + 1 < state.queue.length ? "다음 문항" : "결과 보기";
}

document.getElementById("btn-quiz-next").addEventListener("click", () => {
  if (state.currentIndex + 1 < state.queue.length) {
    state.currentIndex += 1;
    renderQuestion();
  } else {
    renderResult();
    showScreen("result");
  }
});

document.getElementById("btn-quiz-exit").addEventListener("click", () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  showScreen("start");
});

// ---------- 결과 화면 ----------
function renderResult() {
  const byTopic = {};
  state.results.forEach(({ question, correct }) => {
    if (!byTopic[question.topicName]) byTopic[question.topicName] = { total: 0, correct: 0 };
    byTopic[question.topicName].total += 1;
    if (correct) byTopic[question.topicName].correct += 1;
  });

  const summaryEl = document.getElementById("result-summary");
  summaryEl.innerHTML = "";
  Object.entries(byTopic).forEach(([topicName, { total, correct }]) => {
    const solo = correct === total;
    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `
      <span class="result-topic">${topicName}</span>
      <span class="result-badge ${solo ? "badge-solo" : "badge-review"}">${solo ? "혼자 가능" : "다시 보기"}</span>
    `;
    summaryEl.appendChild(row);
  });

  const wrongCount = state.results.filter((r) => !r.correct).length;
  const retryWrongBtn = document.getElementById("btn-retry-wrong");
  retryWrongBtn.hidden = wrongCount === 0;
  retryWrongBtn.textContent = `틀린 문항만 다시 풀기 (${wrongCount}개)`;

  document.getElementById("result-message").textContent =
    wrongCount === 0
      ? "혼자 할 수 있는 내용이 늘었습니다. 오늘도 잘하셨어요."
      : "어려운 문제만 다시 볼 수 있어요. 정답 순서는 매번 다르게 나옵니다.";
}

document.getElementById("btn-retry-wrong").addEventListener("click", () => {
  const wrongQuestions = state.results.filter((r) => !r.correct).map((r) => r.question);
  state.queue = shuffle(wrongQuestions).map((q) => ({ ...q, choices: shuffle(q.choices) }));
  startQuiz();
});

document.getElementById("btn-retry-all").addEventListener("click", () => {
  state.queue = buildQueueFromSelectedTopics();
  startQuiz();
});

document.getElementById("btn-result-home").addEventListener("click", () => showScreen("start"));
document.getElementById("btn-result-topics").addEventListener("click", () => openTopicSelect());
