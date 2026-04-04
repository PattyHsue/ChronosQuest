const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const nodesVisitedEl = document.getElementById('nodes-visited');
const pathLengthEl = document.getElementById('path-length');

const cols = 25;
const rows = 25;
const size = 30;
canvas.width = cols * size;
canvas.height = rows * size;

let grid = [];
let openSet = [];
let closedSet = [];
let start;
let end;
let path = [];
let isSearching = false;

class Node {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous = undefined;
        this.wall = Math.random() < 0.3; // 30% walls
        
        // Ensure start and end are not walls
        if ((i === 0 && j === 0) || (i === cols-1 && j === rows-1)) {
            this.wall = false;
        }
    }

    draw(color) {
        ctx.fillStyle = this.wall ? '#111' : color || 'rgba(255,255,255,0.05)';
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.1)';
        ctx.fillRect(this.i * size + 1, this.j * size + 1, size - 2, size - 2);
        ctx.strokeRect(this.i * size, this.j * size, size, size);
        
        if (this.wall) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.beginPath();
            ctx.moveTo(this.i * size, this.j * size);
            ctx.lineTo((this.i+1) * size, (this.j+1) * size);
            ctx.stroke();
        }
    }

    addNeighbors(grid) {
        let i = this.i;
        let j = this.j;
        if (i < cols - 1) this.neighbors.push(grid[i + 1][j]);
        if (i > 0) this.neighbors.push(grid[i - 1][j]);
        if (j < rows - 1) this.neighbors.push(grid[i][j + 1]);
        if (j > 0) this.neighbors.push(grid[i][j - 1]);
    }
}

function resetGrid() {
    isSearching = false;
    grid = [];
    openSet = [];
    closedSet = [];
    path = [];
    
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Node(i, j);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    openSet.push(start);
    draw();
}

function heuristic(a, b) {
    // Manhattan distance
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].draw();
        }
    }

    for (let node of closedSet) {
        node.draw('rgba(0, 119, 255, 0.2)');
    }

    for (let node of openSet) {
        node.draw('rgba(0, 255, 157, 0.2)');
    }

    // Draw the actual path
    ctx.beginPath();
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff9d';
    for (let i = 0; i < path.length; i++) {
        const x = path[i].i * size + size / 2;
        const y = path[i].j * size + size / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset for other drawings

    // Draw Start and End markers
    ctx.fillStyle = '#00ff9d';
    ctx.fillRect(start.i * size + 5, start.j * size + 5, size - 10, size - 10);
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(end.i * size + 5, end.j * size + 5, size - 10, size - 10);

    nodesVisitedEl.innerText = closedSet.length;
    pathLengthEl.innerText = path.length;
}

function startSearch() {
    if (isSearching) return;
    isSearching = true;
    loop();
}

function loop() {
    if (!isSearching) return;

    if (openSet.length > 0) {
        // Find the node with the lowest f score
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        let current = openSet[winner];

        // Check if finished
        if (current === end) {
            isSearching = false;
            console.log("Path Found!");
        }

        // Move current from open to closed
        openSet.splice(winner, 1);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let neighbor of neighbors) {
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1;

                let newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }

        // Trace back the path
        path = [];
        let temp = current;
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }

        draw();
        requestAnimationFrame(loop);
    } else {
        console.log("No Solution");
        isSearching = false;
        alert("Logic Error: No path found in the current maze environment.");
    }
}

resetGrid();
