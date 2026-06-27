// Huffman Coding Visualizer
let root = null;
let codes = {};

async function buildTree() {
    const inputText = document.getElementById('inputText').value;
    if (!inputText) return;

    try {
        const response = await fetch('/Huffman/BuildTree', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputText)
        });

        const result = await response.json();
        root = result.treeRoot;
        codes = result.codes;

        renderTree();
        displayCodes();
        displayStats(result.originalSize, result.compressedSize);

    } catch (error) {
        console.error('Error building Huffman tree:', error);
    }
}

function renderTree() {
    const svg = document.getElementById('treeSvg');
    svg.innerHTML = '';

    if (!root) {
        document.getElementById('emptyTreeMessage').style.display = 'block';
        return;
    }

    document.getElementById('emptyTreeMessage').style.display = 'none';

    // Start drawing from center top with more horizontal spacing for large trees
    const startX = 600; // Center of 1200 viewBox
    const startY = 50;
    const horizontalSpacing = 250; // Increased spacing

    drawNode(svg, root, startX, startY, horizontalSpacing);
}

function drawNode(svg, node, x, y, offset) {
    if (!node) return;

    // Draw edges to children
    if (node.left) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', y + 20);
        line.setAttribute('x2', x - offset);
        line.setAttribute('y2', y + 80);
        line.setAttribute('stroke', 'gray');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);

        // Edge label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x - offset / 2);
        text.setAttribute('y', y + 40);
        text.setAttribute('fill', '#fbcfe8');
        text.setAttribute('font-size', '10');
        text.textContent = '0';
        svg.appendChild(text);

        drawNode(svg, node.left, x - offset, y + 80, offset / 1.8);
    }

    if (node.right) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', y + 20);
        line.setAttribute('x2', x + offset);
        line.setAttribute('y2', y + 80);
        line.setAttribute('stroke', 'gray');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);

        // Edge label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + offset / 2);
        text.setAttribute('y', y + 40);
        text.setAttribute('fill', '#fbcfe8');
        text.setAttribute('font-size', '10');
        text.textContent = '1';
        svg.appendChild(text);

        drawNode(svg, node.right, x + offset, y + 80, offset / 1.8);
    }

    // Draw node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', node.character !== '\0' ? '#be185d' : '#374151');
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);

    // Draw node text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.textContent = node.character !== '\0' ? `${node.character}:${node.frequency}` : node.frequency;
    svg.appendChild(text);
}

function displayCodes() {
    const codesList = document.getElementById('codesList');
    const section = document.getElementById('codesSection');

    if (Object.keys(codes).length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    codesList.innerHTML = '';

    const sortedCodes = Object.entries(codes).sort((a, b) => a[0].localeCompare(b[0]));

    sortedCodes.forEach(([char, code]) => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 0.5rem;';

        const charSpan = document.createElement('span');
        charSpan.style.cssText = 'font-weight: bold; color: #f9a8d4;';
        charSpan.textContent = char;

        const codeSpan = document.createElement('span');
        codeSpan.style.cssText = 'font-family: monospace; color: #9ca3af;';
        codeSpan.textContent = code;

        div.appendChild(charSpan);
        div.appendChild(codeSpan);
        codesList.appendChild(div);
    });
}

function displayStats(originalSize, compressedSize) {
    const section = document.getElementById('statsSection');

    if (originalSize === 0 && compressedSize === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    document.getElementById('originalSize').textContent = `${originalSize} bits`;
    document.getElementById('compressedSize').textContent = `${compressedSize} bits`;
}

function reset() {
    root = null;
    codes = {};
    document.getElementById('inputText').value = '';
    renderTree();
    document.getElementById('codesSection').style.display = 'none';
    document.getElementById('statsSection').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('buildBtn').addEventListener('click', buildTree);
    document.getElementById('resetBtn').addEventListener('click', reset);

    // Build initial tree with default text
    buildTree();
});
