const krestik = "X";
const circle = "O";

const board = document.getElementsByClassName("container")[0];
const cells = board.querySelectorAll(".allCells");
const startBTN = document.getElementById("btn");
let firstMove = Math.floor(Math.random() * 2 + 1);
let occupiedCells = 0;

const P1 = document.createElement("p");
P1.innerText = "Player moves first";
P1.setAttribute("style", "color:red");
P1.setAttribute("id", "player1");
const P2 = document.createElement("p");
P2.innerText = "Ai moves first";
P2.setAttribute("style", "color:blue");
P2.setAttribute("id", "player2");

startBTN.addEventListener("click", (e) => {
  startGame(); //начало игры
});

function startGame() {
  if (firstMove == 1) {
    //случайный выбор первого ходящего
    document.getElementById("btn").replaceWith(P1);
    playerTurn();
  } else {
    document.getElementById("btn").replaceWith(P2);
    bestMove();
    playerTurn();
  }
}

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
      e.target.innerHTML = krestik;
      e.target.classList.add("occupied", "krestik");
      occupiedCells += 1;
      //если победителя или ничьи нет то ходит бот
      if (checkWinner() == null) {
        bestMove();
      } else {
        if (checkWinner == "X") {
          document.querySelector("p").innerHTML = "Krestiki WINS";
        } else if (checkWinner == "O") {
          document.querySelector("p").innerHTML = "Circle WINS";
        } else {
          document.querySelector("p").innerHTML = "DRAW";
        }
      }
    });
  });
}

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

function checkWinner() {
  for (let arr of winningConditions) {
    //выигрышные комбинации
    let krestikWins = arr.every((i) => cells[i].classList.contains("krestik")); //проверяет для ячейек с Х есть ли комбинация
    let circleWins = arr.every((i) => cells[i].classList.contains("circle")); // тоже самое для O
    if (krestikWins) {
      return "X";
    } else if (circleWins) {
      return "O";
    }
  }
  if (occupiedCells === 9) {
    return "draw";
  }
  return null; //пока нет победителя или ничьи будет возщвращаться null чтобы "memory exceed error" не было
}

function bestMove() {
  let bestScore = Infinity;
  let move = null;

  cells.forEach((cell) => {
    if (!cell.classList.contains("occupied")) {
      cell.classList.add("occupied", "circle");
      occupiedCells += 1;
      let score = minimax(true); //после получения результата за каждый ход выбирается наименьший score, ход имеющий наименьший score выполняется ботом
      occupiedCells -= 1;
      cell.classList.remove("occupied", "circle");
      if (score < bestScore) {
        bestScore = score;
        move = cell;
      }
    }
  });

  if (move) {
    move.innerHTML = circle;
    move.classList.add("circle", "occupied");
    occupiedCells += 1;
    if (checkWinner() == "O") {
      document.querySelector("p").innerHTML = "Circle WINS";
    } else if (checkWinner() == "draw") {
      document.querySelector("p").innerHTML = "DRAW";
    }
  } else {
    console.error("Player won");
  }
}

function minimax(isMaximizing) {
  //base cases
  let result = checkWinner();
  if (result !== null) {
    if (result === "X") return 1; // победа игрока
    if (result === "O") return -1; // победа бота
    if (result === "draw") return 0; // ничья
  }

  if (isMaximizing) {
    //оценка всех ходов за X
    let maxScore = -Infinity;
    cells.forEach((cell) => {
      if (!cell.classList.contains("occupied")) {
        cell.classList.add("occupied", "krestik");
        occupiedCells += 1;
        let score = minimax(false); //после каждого хода оценивается всевозможные следующие ходы за O и по кругу до тех пор пока не будет base case
        occupiedCells -= 1;
        cell.classList.remove("occupied", "krestik");
        maxScore = Math.max(score, maxScore);
      }
    });
    return maxScore;
  } else {
    //оценка всех ходов за O
    let minScore = Infinity;
    cells.forEach((cell) => {
      if (!cell.classList.contains("occupied")) {
        cell.classList.add("occupied", "circle");
        occupiedCells += 1;
        let score = minimax(true);
        occupiedCells -= 1;
        cell.classList.remove("occupied", "circle");
        minScore = Math.min(score, minScore);
      }
    });
    return minScore;
  }
}
