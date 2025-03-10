const krestik =
  '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="10" x2="90" y2="90" stroke="white" stroke-width="5" /><line x1="10" y1="90" x2="90" y2="10" stroke="white" stroke-width="5" /></svg>';

const circle =
  '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="10" fill="none" /></svg>';

const board = document.getElementsByClassName("container")[0];
const cells = board.querySelectorAll(".allCells");
const startBTN = document.getElementById("btn");
let firstMove = Math.floor(Math.random() * 2 + 1);
let counter = 0;

const P1 = document.createElement("p");
P1.innerText = "Player 1 X";
P1.setAttribute("style", "color:red");
P1.setAttribute("id", "player1");
const P2 = document.createElement("p");
P2.innerText = "Player 2 O";
P2.setAttribute("style", "color:blue");
P2.setAttribute("id", "player2");

startBTN.addEventListener("click", (e) => {
  startGame(); //начало игры
});

function startGame() {
  if (firstMove == 1) {
    //случайный выбор первого ходящего
    document.getElementById("btn").replaceWith(P1);
    counter += 1;
    playerTurn();
  } else {
    document.getElementById("btn").replaceWith(P2);
    counter += 2;
    playerTurn();
  }
}

function status() {
  //для показа игрока делающего ход в данный момент
  if (counter % 2 == 0) {
    document.getElementById("player1").replaceWith(P2);
  } else {
    document.getElementById("player2").replaceWith(P1);
  }
}

let occupiedCells = 0;

function playerTurn() {
  //смена очереди игроков и изменения статуса игры
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      checkCell = e.target.firstChild;
      if (checkCell) {
        // проверка занята ли ячейка
        console.log("occupied");
        return;
      }
      if (counter % 2 != 0) {
        e.target.innerHTML = krestik;
        e.target.classList.add("krestik", "occupied");
        checkWinner(); //провереяет есть ли выиграшная комбинация
        counter += 1;
        occupiedCells += 1;
        if (krestikWon) {
          winner();
        } else if (occupiedCells == 9) {
          draw();
        } else {
          status();
        }
      } else {
        e.target.innerHTML = circle;
        e.target.classList.add("circle", "occupied");
        checkWinner();
        counter += 1;
        occupiedCells += 1;
        if (circleWon) {
          winner();
        } else if (occupiedCells == 9) {
          draw();
        } else {
          status();
        }
      }
      console.log(e.target);
    });
  });
}

let krestikWon;
let circleWon;
function checkWinner() {
  //выигрышные комбинации
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  winningConditions.forEach((arr) => {
    let krestikWins = arr.every((i) => cells[i].classList.contains("krestik")); //проверяет для ячейек с Х есть ли комбинация
    let circleWins = arr.every((i) => cells[i].classList.contains("circle")); // тоже самое для O
    if (krestikWins) {
      krestikWon = true;
    } else if (circleWins) {
      circleWon = true;
    }
  });
}

function winner() {
  //остонавливает игру и объявляет победителя и перезагружает сайт для повторной игры
  if (krestikWon) {
    document.querySelector("p").innerHTML = "Krestiki WINS";
    setInterval(function () {
      location.reload(true);
    }, 2000);
  } else if (circleWon) {
    document.querySelector("p").innerHTML = "Circle WINS";
    setInterval(function () {
      location.reload(true);
    }, 2000);
  }
  console.log(cells);
  // код не работает, должен убирать возможность ставить крестики и нолики после окончания игры
  // cells.forEach((cell) => {
  //   cell.removeEventListener("click", console.log("Game ended"));
  // });
}

// ничья
function draw() {
  document.querySelector("p").innerHTML = "DRAW";
  setInterval(function () {
    location.reload(true);
  }, 2000);
}
