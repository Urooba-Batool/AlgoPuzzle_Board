// TSP Visualizer
let cities = [];
let path = [];
let totalDistance = 0;

function initMap() {
    const container = document.getElementById('mapContainer');
    container.addEventListener('click', handleMapClick);
    renderMap();
}

function handleMapClick(e) {
    if (path.length > 0) return; // Cannot add while solved

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    cities.push({ id: cities.length + 1, x: x, y: y });
    renderMap();
    updateStats();
}

function renderMap() {
    const svg = document.getElementById('tspSvg');
    svg.innerHTML = '';

    // Hide/show empty message
    document.getElementById('emptyMessage').style.display = cities.length === 0 ? 'flex' : 'none';

    // Draw path lines
    if (path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
            const c1 = cities[path[i]];
            const c2 = cities[path[i + 1]];

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', `${c1.x}%`);
            line.setAttribute('y1', `${c1.y}%`);
            line.setAttribute('x2', `${c2.x}%`);
            line.setAttribute('y2', `${c2.y}%`);
            line.setAttribute('stroke', '#38bdf8');
            line.setAttribute('stroke-width', '3');
            line.setAttribute('stroke-opacity', '0.8');
            svg.appendChild(line);
        }
    }

    // Draw cities
    cities.forEach((city, index) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', `${city.x}%`);
        circle.setAttribute('cy', `${city.y}%`);
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#f43f5e');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${city.x}%`);
        text.setAttribute('y', `${city.y - 2}%`);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-weight', 'bold');
        text.textContent = city.id;

        g.appendChild(circle);
        g.appendChild(text);
        svg.appendChild(g);
    });
}

function updateStats() {
    document.getElementById('cityCount').textContent = cities.length;
    document.getElementById('totalDistance').textContent = `${Math.round(totalDistance)} px`;
}

function reset() {
    cities = [];
    path = [];
    totalDistance = 0;
    renderMap();
    updateStats();
}

async function solve() {
    if (cities.length < 2) return;

    try {
        // Convert cities to the format expected by C# backend
        const citiesData = cities.map((c, i) => ({ id: i, x: c.x, y: c.y }));

        const response = await fetch('/TSP/SolveTSP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(citiesData)
        });

        const result = await response.json();
        path = result.tour;
        totalDistance = result.totalDistance;

        // Animate path drawing
        for (let i = 0; i < path.length - 1; i++) {
            renderMap();
            await sleep(300);
        }

        renderMap();
        updateStats();

    } catch (error) {
        console.error('Error solving TSP:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('solveBtn').addEventListener('click', solve);
});
