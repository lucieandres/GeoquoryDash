const board = document.getElementById('board');
const player1 = createPlayer('player1', 'blue');
const player2 = createPlayer('player2', 'red');
let currentPlayer = player1;
let gameActive = true;

// Créer le plateau
for (let i = 0; i < 17; i++) {
    for (let j = 0; j < 17; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        // Lignes ou colonnes impaires réservées au déplacement des pions
        if (i % 2 === 0 && j % 2 === 0) {
            cell.classList.add('player-cell');
            cell.addEventListener('click', () => movePlayer(cell));
        } else {
            cell.classList.add('barrier-cell');
            cell.addEventListener('click', (event) => {
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

// Placer les joueurs (au milieu du haut et du bas)
const player1Cell = document.getElementById('cell-0-8');
player1Cell.appendChild(player1);

const player2Cell = document.getElementById('cell-16-8');
player2Cell.appendChild(player2);

// Fonction pour créer un joueur
function createPlayer(className, bgColor) {
    const player = document.createElement('div');
    player.className = `player ${className}`;
    player.style.backgroundColor = bgColor;
    return player;
}

// Fonction pour déplacer le joueur actuel
function movePlayer(targetCell) {
    if (!gameActive) return; // Ne rien faire si le jeu est terminé

    const playerCellId = currentPlayer.parentElement.id;
    const targetCellId = targetCell.id;
    const [x, y] = playerCellId.split('-').slice(1).map(Number);
    const [targetX, targetY] = targetCellId.split('-').slice(1).map(Number);

    // Vérifier si le mouvement est autorisé (exemple : une case à la fois et pas au-dessus d'une barrière)
    if ((Math.abs(targetX - x) === 2 && targetY === y) || (Math.abs(targetY - y) === 2 && targetX === x)) {
        const barrierInBetween = checkBarriersBetween(playerCellId, targetCellId);
        if (!barrierInBetween) {
            targetCell.appendChild(currentPlayer);

            // Vérifier la condition de victoire
            if (currentPlayer === player1 && targetX === 16) {
                endGame('Le joueur 1 a gagné!');
            } else if (currentPlayer === player2 && targetX === 0) {
                endGame('Le joueur 2 a gagné!');
            }

            toggleCurrentPlayer(); // Changer le joueur actuel
        }
    }
}

// Fonction pour vérifier s'il y a une barrière entre deux cellules
function checkBarriersBetween(cellId1, cellId2) {
    const [x1, y1] = cellId1.split('-').slice(1).map(Number);
    const [x2, y2] = cellId2.split('-').slice(1).map(Number);

    // Vérifier s'il y a une barrière horizontale entre les cellules
    if (x1 === x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let y = minY + 1; y < maxY; y += 2) {
            const cell = document.getElementById(`cell-${x1}-${y}`);
            if (cell && cell.querySelector('.barrier')) {
                return true; // Il y a une barrière entre les deux cellules
            }
        }
    }

    // Vérifier s'il y a une barrière verticale entre les cellules
    if (y1 === y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let x = minX + 1; x < maxX; x += 2) {
            const cell = document.getElementById(`cell-${x}-${y1}`);
            if (cell && cell.querySelector('.barrier')) {
                return true; // Il y a une barrière entre les deux cellules
            }
        }
    }

    return false; // Pas de barrière entre les deux cellules
}

// Fonction pour placer une barrière
function toggleBarrier(cell, cell2, cell3) {
    // Vérifier s'il n'y a pas déjà une barrière dans les cellules
    if (!cell.querySelector('.barrier') && (!cell2 || !cell2.querySelector('.barrier')) && (!cell3 || !cell3.querySelector('.barrier'))) {
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
    }
}

// Fonction pour changer le joueur actuel
function toggleCurrentPlayer() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
}

// Fonction pour terminer le jeu
function endGame(message) {
    gameActive = false;
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
    messageElement.classList.add('visible'); // Show the message
    board.classList.add('hidden'); // Hide the board
}