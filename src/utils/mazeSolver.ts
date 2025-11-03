import type { Cell, Algorithm, SolveResult } from '../types/maze';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get valid neighbors for pathfinding
function getNeighbors(cell: Cell, maze: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  for (const [dr, dc] of directions) {
    const newRow = cell.row + dr;
    const newCol = cell.col + dc;
    
    if (
      newRow >= 0 && newRow < maze.length &&
      newCol >= 0 && newCol < maze[0].length &&
      !maze[newRow][newCol].isWall
    ) {
      neighbors.push(maze[newRow][newCol]);
    }
  }

  return neighbors;
}

// Calculate Manhattan distance heuristic
function heuristic(cell: Cell, end: Cell): number {
  return Math.abs(cell.row - end.row) + Math.abs(cell.col - end.col);
}

// Reconstruct path from end to start
async function reconstructPath(
  endCell: Cell,
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<number> {
  let current: Cell | null = endCell;
  let pathLength = 0;

  while (current && !current.isStart) {
    if (!current.isEnd) {
      current.isPath = true;
    }
    current.isCurrent = false;
    setMaze([...maze]);
    if (delay > 0) await sleep(delay);
    current = current.parent;
    pathLength++;
  }

  return pathLength;
}

function calculatePathLength(endCell: Cell): number {
  let current: Cell | null = endCell;
  let length = 0;

  while (current && !current.isStart) {
    length++;
    current = current.parent;
  }

  return length;
}

async function commitFrame(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number,
  frame: Cell[]
): Promise<void> {
  if (frame.length === 0) return;
  setMaze([...maze]);
  if (delay > 0) {
    await sleep(delay);
  }
  frame.forEach(cell => {
    cell.isCurrent = false;
  });
}

// Depth-First Search
async function solveDFS(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  start: Cell,
  end: Cell,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  const stack: Cell[] = [start];
  let visitedCount = 0;

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current.isVisited) continue;

    current.isVisited = true;
    current.isCurrent = true;
    visitedCount++;

    const frame: Cell[] = [current];

    if (current.isEnd) {
      await commitFrame(maze, setMaze, delay, frame);
      const pathLength = findOptimal
        ? await reconstructPath(current, maze, setMaze, delay)
        : calculatePathLength(current);
      return { visited: visitedCount, pathLength };
    }

    const neighbors = getNeighbors(current, maze);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.parent = current;
        stack.push(neighbor);
      }
    }

    await commitFrame(maze, setMaze, delay, frame);
  }

  return { visited: visitedCount, pathLength: 0 };
}

// Breadth-First Search
async function solveBFS(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  start: Cell,
  end: Cell,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  const queue: Cell[] = [start];
  start.isVisited = true;
  let visitedCount = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const frame: Cell[] = [];

    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift()!;
      current.isCurrent = true;
      frame.push(current);
      visitedCount++;

      if (current.isEnd) {
        await commitFrame(maze, setMaze, delay, frame);
        const pathLength = findOptimal
          ? await reconstructPath(current, maze, setMaze, delay)
          : calculatePathLength(current);
        return { visited: visitedCount, pathLength };
      }

      const neighbors = getNeighbors(current, maze);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.parent = current;
          queue.push(neighbor);
        }
      }
    }

    await commitFrame(maze, setMaze, delay, frame);
  }

  return { visited: visitedCount, pathLength: 0 };
}

// Dijkstra's Algorithm
async function solveDijkstra(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  start: Cell,
  end: Cell,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  const unvisited: Cell[] = [];
  start.distance = 0;
  let visitedCount = 0;

  // Initialize all cells
  maze.forEach(row => {
    row.forEach(cell => {
      if (!cell.isWall) {
        unvisited.push(cell);
      }
    });
  });

  while (unvisited.length > 0) {
    // Find cell with minimum distance
    unvisited.sort((a, b) => a.distance - b.distance);
    const current = unvisited.shift()!;

    if (current.distance === Infinity) break;

    current.isVisited = true;
    current.isCurrent = true;
    visitedCount++;

    const frame: Cell[] = [current];

    if (current.isEnd) {
      await commitFrame(maze, setMaze, delay, frame);
      const pathLength = findOptimal
        ? await reconstructPath(current, maze, setMaze, delay)
        : calculatePathLength(current);
      return { visited: visitedCount, pathLength };
    }

    const neighbors = getNeighbors(current, maze);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        const altDistance = current.distance + 1;
        if (altDistance < neighbor.distance) {
          neighbor.distance = altDistance;
          neighbor.parent = current;
        }
      }
    }

    await commitFrame(maze, setMaze, delay, frame);
  }

  return { visited: visitedCount, pathLength: 0 };
}

// A* Search
async function solveAStar(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  start: Cell,
  end: Cell,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  const openSet: Cell[] = [start];
  start.distance = 0;
  start.heuristic = heuristic(start, end);
  let visitedCount = 0;

  while (openSet.length > 0) {
    // Find cell with minimum f = g + h
    openSet.sort((a, b) => 
      (a.distance + a.heuristic) - (b.distance + b.heuristic)
    );
    const current = openSet.shift()!;

    if (current.isVisited) continue;

    current.isVisited = true;
    current.isCurrent = true;
    visitedCount++;

    const frame: Cell[] = [current];

    if (current.isEnd) {
      await commitFrame(maze, setMaze, delay, frame);
      const pathLength = findOptimal
        ? await reconstructPath(current, maze, setMaze, delay)
        : calculatePathLength(current);
      return { visited: visitedCount, pathLength };
    }

    const neighbors = getNeighbors(current, maze);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        const tentativeG = current.distance + 1;
        
        if (tentativeG < neighbor.distance) {
          neighbor.parent = current;
          neighbor.distance = tentativeG;
          neighbor.heuristic = heuristic(neighbor, end);
          
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    await commitFrame(maze, setMaze, delay, frame);
  }

  return { visited: visitedCount, pathLength: 0 };
}

// Greedy Best-First Search
async function solveGreedy(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  start: Cell,
  end: Cell,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  const openSet: Cell[] = [start];
  start.heuristic = heuristic(start, end);
  let visitedCount = 0;

  while (openSet.length > 0) {
    // Find cell with minimum heuristic
    openSet.sort((a, b) => a.heuristic - b.heuristic);
    const current = openSet.shift()!;

    if (current.isVisited) continue;

    current.isVisited = true;
    current.isCurrent = true;
    visitedCount++;

    const frame: Cell[] = [current];

    if (current.isEnd) {
      await commitFrame(maze, setMaze, delay, frame);
      const pathLength = findOptimal
        ? await reconstructPath(current, maze, setMaze, delay)
        : calculatePathLength(current);
      return { visited: visitedCount, pathLength };
    }

    const neighbors = getNeighbors(current, maze);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !openSet.includes(neighbor)) {
        neighbor.parent = current;
        neighbor.heuristic = heuristic(neighbor, end);
        openSet.push(neighbor);
      }
    }

    await commitFrame(maze, setMaze, delay, frame);
  }

  return { visited: visitedCount, pathLength: 0 };
}

// Bidirectional BFS
async function solveBidirectional(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  start: Cell,
  end: Cell,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  const queueStart: Cell[] = [start];
  const queueEnd: Cell[] = [end];
  const visitedStart = new Set<string>();
  const visitedEnd = new Set<string>();
  let visitedCount = 0;
  
  start.isVisited = true;
  end.isVisited = true;
  visitedStart.add(`${start.row},${start.col}`);
  visitedEnd.add(`${end.row},${end.col}`);
  
  while (queueStart.length > 0 && queueEnd.length > 0) {
    const frame: Cell[] = [];
    // Expand from start
    if (queueStart.length > 0) {
      const current = queueStart.shift()!;
      current.isCurrent = true;
      frame.push(current);
      visitedCount++;
      
      const neighbors = getNeighbors(current, maze);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        
        if (visitedEnd.has(key)) {
          // Paths met!
          neighbor.parent = current;
          neighbor.isCurrent = true;
          frame.push(neighbor);
          await commitFrame(maze, setMaze, delay, frame);
          const pathLength = findOptimal
            ? await reconstructPath(neighbor, maze, setMaze, delay)
            : calculatePathLength(neighbor);
          return { visited: visitedCount, pathLength };
        }
        
        if (!visitedStart.has(key) && !neighbor.isWall) {
          visitedStart.add(key);
          neighbor.isVisited = true;
          neighbor.parent = current;
          queueStart.push(neighbor);
        }
      }
    }
    
    // Expand from end
    if (queueEnd.length > 0) {
      const current = queueEnd.shift()!;
      current.isCurrent = true;
      frame.push(current);
      visitedCount++;
      
      const neighbors = getNeighbors(current, maze);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        
        if (visitedStart.has(key)) {
          // Paths met!
          current.parent = neighbor;
          neighbor.isCurrent = true;
          frame.push(neighbor);
          await commitFrame(maze, setMaze, delay, frame);
          const pathLength = findOptimal
            ? await reconstructPath(end, maze, setMaze, delay)
            : calculatePathLength(end);
          return { visited: visitedCount, pathLength };
        }
        
        if (!visitedEnd.has(key) && !neighbor.isWall) {
          visitedEnd.add(key);
          neighbor.isVisited = true;
          neighbor.parent = current;
          queueEnd.push(neighbor);
        }
      }
    }

    await commitFrame(maze, setMaze, delay, frame);
  }
  
  return { visited: visitedCount, pathLength: 0 };
}

// Best-First Search (using only heuristic)
async function solveBestFirst(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  start: Cell,
  end: Cell,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  const openSet: Cell[] = [start];
  start.heuristic = heuristic(start, end);
  let visitedCount = 0;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.heuristic - b.heuristic);
    const current = openSet.shift()!;

    if (current.isVisited) continue;

    current.isVisited = true;
    current.isCurrent = true;
    visitedCount++;

    const frame: Cell[] = [current];

    if (current.isEnd) {
      await commitFrame(maze, setMaze, delay, frame);
      const pathLength = findOptimal
        ? await reconstructPath(current, maze, setMaze, delay)
        : calculatePathLength(current);
      return { visited: visitedCount, pathLength };
    }

    const neighbors = getNeighbors(current, maze);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !openSet.includes(neighbor)) {
        neighbor.parent = current;
        neighbor.heuristic = heuristic(neighbor, end);
        openSet.push(neighbor);
      }
    }

    await commitFrame(maze, setMaze, delay, frame);
  }

  return { visited: visitedCount, pathLength: 0 };
}

export async function solveMaze(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  algorithm: Algorithm,
  delay: number,
  findOptimal: boolean = true
): Promise<SolveResult> {
  // Find start and end cells
  let start: Cell | null = null;
  let end: Cell | null = null;

  for (const row of maze) {
    for (const cell of row) {
      if (cell.isStart) start = cell;
      if (cell.isEnd) end = cell;
    }
  }

  if (!start || !end) {
    return { visited: 0, pathLength: 0 };
  }

  switch (algorithm) {
    case 'dfs':
      return await solveDFS(maze, setMaze, start, end, delay, findOptimal);
    case 'bfs':
      return await solveBFS(maze, setMaze, start, end, delay, findOptimal);
    case 'dijkstra':
      return await solveDijkstra(maze, setMaze, start, end, delay, findOptimal);
    case 'astar':
      return await solveAStar(maze, setMaze, start, end, delay, findOptimal);
    case 'greedy':
      return await solveGreedy(maze, setMaze, start, end, delay, findOptimal);
    case 'bidirectional':
      return await solveBidirectional(maze, setMaze, start, end, delay, findOptimal);
    case 'bestfirst':
      return await solveBestFirst(maze, setMaze, start, end, delay, findOptimal);
    default:
      return { visited: 0, pathLength: 0 };
  }
}

