// Knight's Tour Visualizer
let path = [];
let currentIndex = -1;
let isSolving = false;
let currentPos = [0, 0];

function initBoard() {
    const board = document.getElementById('knightBoard');
    board.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                cursor: pointer;
                background: ${(row + col) % 2 === 0 ? '#cbd5e1' : '#475569'};
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => setStart(row, col));
            board.appendChild(cell);
        }
    }

    updateBoard();
}

function setStart(row, col) {
    if (isSolving) return;
    currentPos = [row, col];
    path = [];
    currentIndex = -1;
    updateBoard();
}

function updateBoard() {
    const cells = document.querySelectorAll('#knightBoard > div');

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const stepIndex = getStepIndex(row, col);
        const isVisited = stepIndex !== -1 && stepIndex <= currentIndex;
        const isCurrent = currentPos[0] === row && currentPos[1] === col;

        cell.innerHTML = '';

        // Reset background
        cell.style.background = (row + col) % 2 === 0 ? '#cbd5e1' : '#475569';

        // Show knight on current position
        if (isCurrent && path.length > 0) {
            cell.innerHTML = '<span style="font-size: 2.5rem; color: #34d399; filter: drop-shadow(0 0 10px #34d399);">♞</span>';
        } else if (isCurrent && path.length === 0) {
            // Show knight on start position before solving
            cell.innerHTML = '<span style="font-size: 2.5rem; color: #34d399;">♞</span>';
        } else if (isVisited) {
            // Show visited numbers
            cell.innerHTML = `<span style="font-size: 0.75rem; font-family: monospace; color: #6ee7b7;">${stepIndex + 1}</span>`;
            cell.style.background = isVisited ? 'rgba(16, 185, 129, 0.2)' : cell.style.background;
        }
    });

    drawPath();
}

function getStepIndex(row, col) {
    for (let i = 0; i < path.length; i++) {
        if (path[i][0] === row && path[i][1] === col) return i;
    }
    return -1;
}

function drawPath() {
    const svg = document.getElementById('pathSvg');
    svg.innerHTML = '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#34d399" /></marker></defs>';

    if (path.length <= 1) return;

    const multiplier = 12.5;
    const offset = 6.25;

    for (let i = 0; i < currentIndex && i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${p1[1] * multiplier + offset}%`);
        line.setAttribute('y1', `${p1[0] * multiplier + offset}%`);
        line.setAttribute('x2', `${p2[1] * multiplier + offset}%`);
        line.setAttribute('y2', `${p2[0] * multiplier + offset}%`);
        line.setAttribute('stroke', '#34d399');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrow)');
        line.setAttribute('opacity', '0.7');
        svg.appendChild(line);
    }
}

async function visualize() {
    if (isSolving) return;
    isSolving = true;
    document.getElementById('solveBtn').textContent = 'Touring...';

    try {
        const response = await fetch('/KnightsTour/SolveTour', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startRow: currentPos[0], startCol: currentPos[1] })
        });

        path = await response.json();
        currentIndex = 0;

        while (currentIndex < path.length - 1 && isSolving) {
            currentPos = path[currentIndex];
            updateBoard();
            updateStats();
            await sleep(100);
            currentIndex++;
        }

        currentPos = path[currentIndex];
        updateBoard();
        updateStats();

    } catch (error) {
        console.error('Error:', error);
    }

    isSolving = false;
    document.getElementById('solveBtn').textContent = 'Start Tour';
}

function updateStats() {
    const visited = currentIndex + 1;
    document.getElementById('visited').textContent = `${visited} / 64`;
    document.getElementById('progressFill').style.width = `${(visited / 64) * 100}%`;
}

function reset() {
    isSolving = false;
    path = [];
    currentIndex = -1;
    currentPos = [0, 0];
    updateBoard();
    document.getElementById('visited').textContent = '0 / 64';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('solveBtn').textContent = 'Start Tour';
}

document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('solveBtn').addEventListener('click', visualize);
});
