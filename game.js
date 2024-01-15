const board = document.getElementById('board');
const player1 = createPlayer('player1', 'blue');
const player2 = createPlayer('player2', 'red');
let currentPlayer = player1;
let gameActive = true;

for (let i = 0; i < 17; i++) {
    for (let j = 0; j < 17; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        if (i % 2 === 0 && j % 2 === 0) {
            cell.classList.add('player-cell');
            cell.addEventListener('click', () => movePlayer(cell));
        } else {
            cell.classList.add('barrier-cell');
            cell.addEventListener('click', function (event) {
                event.preventDefault();
                if (i % 2 === 0 && j % 2 !== 0) {
                    if (i === 16)
                        toggleBarrier(cell, document.getElementById(`cell-${i - 1}-${j}`), document.getElementById(`cell-${i - 2}-${j}`));
                    else
                        toggleBarrier(cell, document.getElementById(`cell-${i + 1}-${j}`), document.getElementById(`cell-${i + 2}-${j}`));
                } else if (j % 2 === 0 && i % 2 !== 0) {
                    if (j === 16)
                        toggleBarrier(cell, document.getElementById(`cell-${i}-${j - 1}`), document.getElementById(`cell-${i}-${j - 2}`));
                    else
                        toggleBarrier(cell, document.getElementById(`cell-${i}-${j + 1}`), document.getElementById(`cell-${i}-${j + 2}`));
                }
            });
        }

        cell.id = `cell-${i}-${j}`;
        board.appendChild(cell);
    }
}

const player1Cell = document.getElementById('cell-0-8');
player1Cell.appendChild(player1);

const player2Cell = document.getElementById('cell-16-8');
player2Cell.appendChild(player2);

function createPlayer(className, bgColor) {
    const player = document.createElement('div');
    player.className = `player ${className}`;
    player.style.backgroundColor = bgColor;
    return player;
}

function movePlayer(targetCell) {
    if (!gameActive) return;

    const playerCellId = currentPlayer.parentElement.id;
    const targetCellId = targetCell.id;
    const [x, y] = playerCellId.split('-').slice(1).map(Number);
    const [targetX, targetY] = targetCellId.split('-').slice(1).map(Number);

    if ((Math.abs(targetX - x) === 2 && targetY === y) || (Math.abs(targetY - y) === 2 && targetX === x)) {
        const barrierInBetween = checkBarriersBetween(playerCellId, targetCellId);
        if (!barrierInBetween) {
            targetCell.appendChild(currentPlayer);
            if (currentPlayer === player1 && targetX === 16) {
                endGame('Le joueur 1 a gagné!');
            } else if (currentPlayer === player2 && targetX === 0) {
                endGame('Le joueur 2 a gagné!');
            }
            turn();
        }
    }
}

function checkBarriersBetween(cellId1, cellId2) {
    const [x1, y1] = cellId1.split('-').slice(1).map(Number);
    const [x2, y2] = cellId2.split('-').slice(1).map(Number);

    if (x1 === x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let y = minY + 1; y < maxY; y += 2) {
            const cell = document.getElementById(`cell-${x1}-${y}`);
            if (cell.querySelector('.barrier') && cell) {
                return true;
            }
        }
    }

    if (y1 === y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let x = minX + 1; x < maxX; x += 2) {
            const cell = document.getElementById(`cell-${x}-${y1}`);
            if (cell.querySelector('.barrier') && cell) {
                return true;
            }
        }
    }

    return false;
}

function toggleBarrier(cell, cell2, cell3) {
    if (!cell.querySelector('.barrier') && (!cell2.querySelector('.barrier') || !cell2) && (!cell3.querySelector('.barrier') || !cell3)) {
        const barrier = document.createElement('div');
        barrier.className = 'barrier';
        cell.appendChild(barrier);
        if (cell2) {
            const barrier2 = document.createElement('div');
            barrier2.className = 'barrier';
            cell2.appendChild(barrier2);
        }
        if (cell3) {
            const barrier3 = document.createElement('div');
            barrier3.className = 'barrier';
            cell3.appendChild(barrier3);
        }
        turn();
    }
}

function turn() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
}

function endGame(message) {
    gameActive = false;
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
    messageElement.classList.add('visible');
    board.classList.add('hidden');
}