// N-Queens Visualizer JavaScript
const N = 8;
let board = new Array(N).fill(-1); // board[row] = col, -1 if empty
let isSolving = false;
let currentStep = 0;
let solutionSteps = [];

// Initialize the board
function initBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', () => toggleQueen(row, col));
            chessboard.appendChild(square);
        }
    }

    updateBoard();
}

// Toggle queen placement (manual mode)
function toggleQueen(row, col) {
    if (isSolving) return;

    if (board[row] === col) {
        board[row] = -1;
    } else {
        board[row] = col;
    }

    updateBoard();
    updateStats();
}

// Update the visual board
function updateBoard() {
    const squares = document.querySelectorAll('.chess-square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        square.innerHTML = '';
        square.classList.remove('unsafe');

        // Check if queen is placed here
        if (board[row] === col) {
            const queen = document.createElement('span');
            queen.textContent = '♛';
            queen.className = 'animate-bounce-in';
            queen.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
            square.appendChild(queen);

            // Check if this position is safe
            if (!isSafe(row, col)) {
                square.classList.add('unsafe');
            }
        }
    });
}

// Check if a position is safe
function isSafe(row, col) {
    // Check against other queens
    for (let r = 0; r < N; r++) {
        if (r === row) continue;
        if (board[r] === -1) continue;

        const c = board[r];
        if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
            return false;
        }
    }
    return true;
}

// Update stats display
function updateStats() {
    const queensCount = board.filter(c => c !== -1).length;
    document.getElementById('queensPlaced').textContent = `${queensCount} / ${N}`;

    // Update progress percentage
    const progress = Math.round((queensCount / N) * 100);
    document.getElementById('progressPercent').textContent = `${progress}%`;
}

// Reset board
function resetBoard() {
    board = new Array(N).fill(-1);
    isSolving = false;
    currentStep = 0;
    solutionSteps = [];
    updateBoard();
    updateStats();
    document.getElementById('backtracks').textContent = '0';
    document.getElementById('solveBtn').textContent = 'Auto Solve';
}

// Solve using backtracking (call C# backend)
async function startSolver() {
    if (isSolving) return;

    resetBoard();
    isSolving = true;
    document.getElementById('solveBtn').textContent = 'Solving...';

    try {
        const response = await fetch('/NQueens/Solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(N)
        });

        solutionSteps = await response.json();

        // Animate the solution
        await animateSolution();

    } catch (error) {
        console.error('Error solving N-Queens:', error);
    }

    isSolving = false;
    document.getElementById('solveBtn').textContent = 'Auto Solve';
}

// Animate the solution steps
async function animateSolution() {
    for (let i = 0; i < solutionSteps.length; i++) {
        const step = solutionSteps[i];
        board = [...step.board];

        updateBoard();
        document.getElementById('backtracks').textContent = step.backtracks;

        const queensCount = board.filter(c => c !== -1).length;
        document.getElementById('queensPlaced').textContent = `${queensCount} / ${N}`;

        // Delay for animation
        await sleep(step.isSolution ? 200 : 50);
    }
}

// Helper sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initBoard();

    document.getElementById('resetBtn').addEventListener('click', resetBoard);
    document.getElementById('solveBtn').addEventListener('click', startSolver);
});
