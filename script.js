function Gameboard() {
  const gameBoard = Array(9).fill('');
  let currentPlayer = null;
  let terminateGame = false;

  const WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // check game result
  function judge(mark, gameBoard) {
    const hasWon = WINNING_LINES.some(line => 
        line.every(index => gameBoard[index] === mark)
    );

    if (hasWon) {
        terminateGame = true;
        return { result: "win", winnerMark: mark };
    }

    const isDraw = gameBoard.every(cell => cell !== '');

    if (isDraw) {
        terminateGame = true;
        return { result: "draw" };
    }

    return { result: "continue" };
  }

  function resetBoard() {
    terminateGame = false;
    gameBoard.fill('');
    currentPlayer = player1;
  }

  // create player
  function createPlayer(mark) {
    return {
      mark,
      switchPlayer: null,

      play(x, y) {
        if (terminateGame) return;

        const boardLocation = 3 * y + x;

        if (
          boardLocation < 0 ||
          boardLocation >= 9 ||
          gameBoard[boardLocation] !== ''
        ) {
          return;
        }

        gameBoard[boardLocation] = this.mark;
        const outcome = judge(this.mark, gameBoard);

        if (outcome.result === "continue") {
            currentPlayer = this.switchPlayer;
        } else {
            console.log(outcome);
        }
      }
    };
  }

  const player1 = createPlayer('X');
  const player2 = createPlayer('O');

  player1.switchPlayer = player2;
  player2.switchPlayer = player1;

  currentPlayer = player1;

  return {
    playTurn(x, y) {
      currentPlayer.play(x, y);
    },
    getBoard() {
      return [...gameBoard];
    },
    resetBoard
  };
}

function displayController(game) {
    const cells = document.querySelectorAll('.cell');

    function render() {
        const gameBoard = game.getBoard();
        gameBoard.forEach((mark, index) => {
            cells[index].textContent = mark;
        });
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = Number(cell.dataset.index);
            const x = index % 3;
            const y = Math.floor(index / 3);

            game.playTurn(x, y);

            render();
        });
    });

    return {render};
}

const game = Gameboard();
const display = displayController(game);

// display.render();