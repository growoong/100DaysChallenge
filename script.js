const targetDate = new Date("2025-01-01");
let goal = "새해까지 나의 목표는?";
let completedDays = [];

function getDaysLeft() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timeDiff = targetDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1);
}

function updateDdayDisplay() {
  const daysLeft = getDaysLeft();
  const ddayDisplay = document.getElementById("dday-display");
  ddayDisplay.textContent = daysLeft === 0 ? "축하합니다!" : `D-${daysLeft}`;
}

function getDateString(dayOffset) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function createFrogGrid() {
  const grid = document.getElementById("frog-grid");
  grid.innerHTML = "";
  const daysLeft = getDaysLeft();

  for (let i = 0; i < 100; i++) {
    const frogContainer = document.createElement("div");
    const frog = document.createElement("img");
    frog.src = completedDays.includes(i) ? "frog_completed.svg" : "frog.svg";
    frog.classList.add("frog-icon");
    if (i > daysLeft) {
      frog.classList.add("disabled");
      frog.style.opacity = "0.5";
    }
    frog.onclick = () => handleDayClick(i);

    const dateLabel = document.createElement("div");
    dateLabel.textContent = getDateString(i);
    dateLabel.classList.add("date-label");

    frogContainer.appendChild(frog);
    frogContainer.appendChild(dateLabel);
    grid.appendChild(frogContainer);
  }
}

function handleDayClick(day) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const clickedDate = new Date();
  clickedDate.setDate(clickedDate.getDate() + day);
  clickedDate.setHours(0, 0, 0, 0);

  if (clickedDate.getTime() !== today.getTime()) {
    showAlert("오늘 날짜만 클릭할 수 있습니다.");
    return;
  }

  if (completedDays.includes(day)) {
    completedDays = completedDays.filter((d) => d !== day);
  } else {
    completedDays.push(day);
  }
  updateCompletedCount();
  createFrogGrid();
  saveData();
}

function updateCompletedCount() {
  const countDisplay = document.getElementById("completed-count");
  countDisplay.textContent = `지금까지 완료한 목표: ${completedDays.length}개`;
}

function editGoal() {
  const newGoal = prompt("새로운 목표를 입력하세요:", goal);
  if (newGoal !== null && newGoal.trim() !== "") {
    goal = newGoal.trim();
    document.getElementById("goal-display").textContent = goal;
    saveData();
  }
}

function showAlert(message) {
  document.getElementById("alert-message").textContent = message;
  document.getElementById("alert").style.display = "flex";
}

function closeAlert() {
  document.getElementById("alert").style.display = "none";
}

function saveData() {
  localStorage.setItem("goal", goal);
  localStorage.setItem("completedDays", JSON.stringify(completedDays));
}

function loadData() {
  const savedGoal = localStorage.getItem("goal");
  const savedCompletedDays = JSON.parse(localStorage.getItem("completedDays"));

  if (savedGoal) {
    goal = savedGoal;
    document.getElementById("goal-display").textContent = goal;
  }
  if (savedCompletedDays) {
    completedDays = savedCompletedDays;
    updateCompletedCount();
  }
}

window.onload = function () {
  loadData();
  updateDdayDisplay();
  createFrogGrid();
};
