import type { Cell, GenerationAlgorithm, MazeSize } from '../types/maze';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Shuffle array helper
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Get neighbors for generation (cells 2 steps away)
function getGenerationNeighbors(row: number, col: number, maze: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const directions = [
    [-2, 0], [2, 0], [0, -2], [0, 2]
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (
      newRow > 0 && newRow < maze.length - 1 &&
      newCol > 0 && newCol < maze[0].length - 1 &&
      maze[newRow]?.[newCol]
    ) {
      neighbors.push(maze[newRow][newCol]);
    }
  }

  return neighbors;
}

// Recursive Backtracking
async function generateRecursiveBacktracking(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  const stack: Cell[] = [];
  const startCell = maze[1][1];
  startCell.isVisited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getGenerationNeighbors(current.row, current.col, maze)
      .filter(n => !n.isVisited && n.isWall);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Remove wall between current and next
      const wallRow = (current.row + next.row) / 2;
      const wallCol = (current.col + next.col) / 2;
      maze[wallRow][wallCol].isWall = false;
      
      next.isWall = false;
      next.isVisited = true;
      stack.push(next);

      if (delay > 0) {
        setMaze([...maze]);
        await sleep(delay);
      }
    } else {
      stack.pop();
    }
  }

  // Clean up visited flags
  maze.forEach(row => row.forEach(cell => cell.isVisited = false));
  maze[1][1].isVisited = false;
  maze[maze.length - 2][maze[0].length - 2].isVisited = false;
  setMaze([...maze]);
}

// Kruskal's Algorithm
async function generateKruskal(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  // Union-Find data structure
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();

  function find(cell: string): string {
    if (parent.get(cell) !== cell) {
      parent.set(cell, find(parent.get(cell)!));
    }
    return parent.get(cell)!;
  }

  function union(cell1: string, cell2: string): boolean {
    const root1 = find(cell1);
    const root2 = find(cell2);

    if (root1 === root2) return false;

    const rank1 = rank.get(root1) || 0;
    const rank2 = rank.get(root2) || 0;

    if (rank1 < rank2) {
      parent.set(root1, root2);
    } else if (rank1 > rank2) {
      parent.set(root2, root1);
    } else {
      parent.set(root2, root1);
      rank.set(root1, rank1 + 1);
    }
    return true;
  }

  // Initialize cells
  const cells: Cell[] = [];
  for (let row = 1; row < maze.length - 1; row += 2) {
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      const cellKey = `${row},${col}`;
      parent.set(cellKey, cellKey);
      rank.set(cellKey, 0);
      cells.push(maze[row][col]);
      maze[row][col].isWall = false;
    }
  }

  // Get all walls
  const walls: Array<{ row: number; col: number; cell1: Cell; cell2: Cell }> = [];
  for (let row = 1; row < maze.length - 1; row += 2) {
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      if (col + 2 < maze[0].length - 1) {
        walls.push({
          row,
          col: col + 1,
          cell1: maze[row][col],
          cell2: maze[row][col + 2]
        });
      }
      if (row + 2 < maze.length - 1) {
        walls.push({
          row: row + 1,
          col,
          cell1: maze[row][col],
          cell2: maze[row + 2][col]
        });
      }
    }
  }

  shuffle(walls);

  for (const wall of walls) {
    const key1 = `${wall.cell1.row},${wall.cell1.col}`;
    const key2 = `${wall.cell2.row},${wall.cell2.col}`;

    if (union(key1, key2)) {
      maze[wall.row][wall.col].isWall = false;
      if (delay > 0) {
        setMaze([...maze]);
        await sleep(delay);
      }
    }
  }
  
  setMaze([...maze]);
}

// Prim's Algorithm
async function generatePrim(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  const walls: Array<{ wall: Cell; cell1: Cell; cell2: Cell }> = [];
  const inMaze = new Set<string>();

  // Start with random cell
  const startRow = 1;
  const startCol = 1;
  maze[startRow][startCol].isWall = false;
  inMaze.add(`${startRow},${startCol}`);

  // Add walls of starting cell
  const addWalls = (row: number, col: number) => {
    const directions = [
      { dr: -2, dc: 0, wr: -1, wc: 0 },
      { dr: 2, dc: 0, wr: 1, wc: 0 },
      { dr: 0, dc: -2, wr: 0, wc: -1 },
      { dr: 0, dc: 2, wr: 0, wc: 1 }
    ];

    for (const { dr, dc, wr, wc } of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const wallRow = row + wr;
      const wallCol = col + wc;

      if (
        newRow > 0 && newRow < maze.length - 1 &&
        newCol > 0 && newCol < maze[0].length - 1 &&
        !inMaze.has(`${newRow},${newCol}`)
      ) {
        walls.push({
          wall: maze[wallRow][wallCol],
          cell1: maze[row][col],
          cell2: maze[newRow][newCol]
        });
      }
    }
  };

  addWalls(startRow, startCol);

  while (walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const { wall, cell2 } = walls[randomIndex];
    walls.splice(randomIndex, 1);

    const key2 = `${cell2.row},${cell2.col}`;
    if (!inMaze.has(key2)) {
      wall.isWall = false;
      cell2.isWall = false;
      inMaze.add(key2);
      addWalls(cell2.row, cell2.col);

      if (delay > 0) {
        setMaze([...maze]);
        await sleep(delay);
      }
    }
  }
  
  setMaze([...maze]);
}

// Wilson's Algorithm (Loop-Erased Random Walk)
async function generateWilson(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  const cells: Cell[] = [];
  for (let row = 1; row < maze.length - 1; row += 2) {
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      cells.push(maze[row][col]);
      maze[row][col].isWall = false;
    }
  }

  const inMaze = new Set<string>();
  const firstCell = cells[Math.floor(Math.random() * cells.length)];
  inMaze.add(`${firstCell.row},${firstCell.col}`);

  const unvisited = cells.filter(c => !inMaze.has(`${c.row},${c.col}`));

  while (unvisited.length > 0) {
    let current = unvisited[Math.floor(Math.random() * unvisited.length)];
    const path: Cell[] = [current];

    while (!inMaze.has(`${current.row},${current.col}`)) {
      const neighbors = getGenerationNeighbors(current.row, current.col, maze);
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];

      // Check for loop
      const loopIndex = path.findIndex(c => c.row === next.row && c.col === next.col);
      if (loopIndex !== -1) {
        path.splice(loopIndex + 1);
      } else {
        path.push(next);
      }

      current = next;
    }

    // Add path to maze
    for (let i = 0; i < path.length - 1; i++) {
      const curr = path[i];
      const next = path[i + 1];
      const wallRow = (curr.row + next.row) / 2;
      const wallCol = (curr.col + next.col) / 2;
      maze[wallRow][wallCol].isWall = false;
      inMaze.add(`${curr.row},${curr.col}`);

      if (delay > 0) {
        setMaze([...maze]);
        await sleep(delay / 2);
      }
    }

    unvisited.splice(0, unvisited.length, ...cells.filter(c => !inMaze.has(`${c.row},${c.col}`)));
  }
  
  setMaze([...maze]);
}

// Eller's Algorithm
async function generateEller(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  let currentSet = 0;
  const sets = new Map<string, number>();

  for (let row = 1; row < maze.length - 1; row += 2) {
    // Assign sets to unassigned cells
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      const key = `${row},${col}`;
      if (!sets.has(key)) {
        sets.set(key, currentSet++);
      }
      maze[row][col].isWall = false;
    }

    // Randomly join adjacent cells
    for (let col = 1; col < maze[0].length - 3; col += 2) {
      const key1 = `${row},${col}`;
      const key2 = `${row},${col + 2}`;
      const set1 = sets.get(key1)!;
      const set2 = sets.get(key2)!;

      if (set1 !== set2 && (Math.random() < 0.5 || row === maze.length - 2)) {
        maze[row][col + 1].isWall = false;
        // Merge sets
        for (const [k, v] of sets.entries()) {
          if (v === set2) sets.set(k, set1);
        }

        if (delay > 0) {
          setMaze([...maze]);
          await sleep(delay);
        }
      }
    }

    // Create vertical connections
    if (row < maze.length - 2) {
      const setConnections = new Map<number, boolean>();
      for (let col = 1; col < maze[0].length - 1; col += 2) {
        const key = `${row},${col}`;
        const set = sets.get(key)!;

        if (!setConnections.get(set) || Math.random() < 0.5) {
          maze[row + 1][col].isWall = false;
          sets.set(`${row + 2},${col}`, set);
          setConnections.set(set, true);

          if (delay > 0) {
            setMaze([...maze]);
            await sleep(delay);
          }
        }
      }
    }
  }
  
  setMaze([...maze]);
}

// Binary Tree Algorithm
async function generateBinaryTree(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  for (let row = 1; row < maze.length - 1; row += 2) {
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      maze[row][col].isWall = false;
      
      const directions: Array<[number, number]> = [];
      if (row > 1) directions.push([-2, 0]); // North
      if (col > 1) directions.push([0, -2]); // West
      
      if (directions.length > 0) {
        const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
        const wallRow = row + dr / 2;
        const wallCol = col + dc / 2;
        maze[wallRow][wallCol].isWall = false;
        
        if (delay > 0) {
          setMaze([...maze]);
          await sleep(delay);
        }
      }
    }
  }
  setMaze([...maze]);
}

// Sidewinder Algorithm
async function generateSidewinder(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  for (let row = 1; row < maze.length - 1; row += 2) {
    const runSet: number[] = [];
    
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      maze[row][col].isWall = false;
      runSet.push(col);
      
      const carveEast = col < maze[0].length - 2 && (row === 1 || Math.random() < 0.5);
      
      if (carveEast) {
        maze[row][col + 1].isWall = false;
      } else {
        const randomCol = runSet[Math.floor(Math.random() * runSet.length)];
        if (row > 1) {
          maze[row - 1][randomCol].isWall = false;
        }
        runSet.length = 0;
      }
      
      if (delay > 0) {
        setMaze([...maze]);
        await sleep(delay);
      }
    }
  }
  setMaze([...maze]);
}

// Aldous-Broder Algorithm
async function generateAldousBroder(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  const cells: Cell[] = [];
  for (let row = 1; row < maze.length - 1; row += 2) {
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      maze[row][col].isWall = false;
      cells.push(maze[row][col]);
    }
  }
  
  let current = cells[Math.floor(Math.random() * cells.length)];
  let unvisited = cells.length - 1;
  current.isVisited = true;
  
  while (unvisited > 0) {
    const neighbors = getGenerationNeighbors(current.row, current.col, maze);
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    
    if (!next.isVisited) {
      const wallRow = (current.row + next.row) / 2;
      const wallCol = (current.col + next.col) / 2;
      maze[wallRow][wallCol].isWall = false;
      next.isVisited = true;
      unvisited--;
      
      if (delay > 0) {
        setMaze([...maze]);
        await sleep(delay);
      }
    }
    
    current = next;
  }
  
  maze.forEach(row => row.forEach(cell => cell.isVisited = false));
  setMaze([...maze]);
}

// Hunt and Kill Algorithm
async function generateHuntAndKill(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  delay: number
): Promise<void> {
  const cells: Cell[] = [];
  for (let row = 1; row < maze.length - 1; row += 2) {
    for (let col = 1; col < maze[0].length - 1; col += 2) {
      maze[row][col].isWall = false;
      cells.push(maze[row][col]);
    }
  }
  
  let current: Cell | null = cells[Math.floor(Math.random() * cells.length)];
  current.isVisited = true;
  
  while (current) {
    const unvisitedNeighbors = getGenerationNeighbors(current.row, current.col, maze)
      .filter(n => !n.isVisited);
    
    if (unvisitedNeighbors.length > 0) {
      const next = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
      const wallRow = (current.row + next.row) / 2;
      const wallCol = (current.col + next.col) / 2;
      maze[wallRow][wallCol].isWall = false;
      next.isVisited = true;
      current = next;
      
      if (delay > 0) {
        setMaze([...maze]);
        await sleep(delay);
      }
    } else {
      // Hunt for next unvisited cell with visited neighbor
      current = null;
      for (const cell of cells) {
        if (!cell.isVisited) {
          const visitedNeighbors = getGenerationNeighbors(cell.row, cell.col, maze)
            .filter(n => n.isVisited);
          
          if (visitedNeighbors.length > 0) {
            const neighbor = visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)];
            const wallRow = (cell.row + neighbor.row) / 2;
            const wallCol = (cell.col + neighbor.col) / 2;
            maze[wallRow][wallCol].isWall = false;
            cell.isVisited = true;
            current = cell;
            
            if (delay > 0) {
              setMaze([...maze]);
              await sleep(delay);
            }
            break;
          }
        }
      }
    }
  }
  
  maze.forEach(row => row.forEach(cell => cell.isVisited = false));
  setMaze([...maze]);
}

export async function generateMaze(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  algorithm: GenerationAlgorithm,
  delay: number,
  mazeSize: MazeSize
): Promise<void> {
  // Reset maze to all walls
  maze.forEach(row => {
    row.forEach(cell => {
      cell.isWall = true;
      cell.isVisited = false;
      cell.isPath = false;
      cell.isCurrent = false;
    });
  });

  // Keep start and end
  maze[1][1].isWall = false;
  maze[mazeSize.rows - 2][mazeSize.cols - 2].isWall = false;
  setMaze([...maze]);

  switch (algorithm) {
    case 'recursive':
      await generateRecursiveBacktracking(maze, setMaze, delay);
      break;
    case 'kruskal':
      await generateKruskal(maze, setMaze, delay);
      break;
    case 'prim':
      await generatePrim(maze, setMaze, delay);
      break;
    case 'wilson':
      await generateWilson(maze, setMaze, delay);
      break;
    case 'eller':
      await generateEller(maze, setMaze, delay);
      break;
    case 'binarytree':
      await generateBinaryTree(maze, setMaze, delay);
      break;
    case 'sidewinder':
      await generateSidewinder(maze, setMaze, delay);
      break;
    case 'aldousbroder':
      await generateAldousBroder(maze, setMaze, delay);
      break;
    case 'huntandkill':
      await generateHuntAndKill(maze, setMaze, delay);
      break;
  }
  
  // Ensure start and end are connected - verify path exists
  await ensurePathExists(maze, setMaze, mazeSize);
}

// Ensure there's a path from start to end using simple path-finding
async function ensurePathExists(
  maze: Cell[][],
  setMaze: (maze: Cell[][]) => void,
  mazeSize: MazeSize
): Promise<void> {
  const start = maze[1][1];
  const end = maze[mazeSize.rows - 2][mazeSize.cols - 2];
  
  // BFS to check if path exists
  const queue: Cell[] = [start];
  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current === end) {
      return; // Path exists, we're good!
    }
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;
      const key = `${newRow},${newCol}`;
      
      if (
        newRow >= 0 && newRow < maze.length &&
        newCol >= 0 && newCol < maze[0].length &&
        !visited.has(key) &&
        !maze[newRow][newCol].isWall
      ) {
        visited.add(key);
        queue.push(maze[newRow][newCol]);
      }
    }
  }
  
  // No path found, create one using simple path
  let row = start.row;
  let col = start.col;
  
  while (row !== end.row || col !== end.col) {
    if (row < end.row) {
      row++;
      maze[row][col].isWall = false;
    } else if (row > end.row) {
      row--;
      maze[row][col].isWall = false;
    } else if (col < end.col) {
      col++;
      maze[row][col].isWall = false;
    } else if (col > end.col) {
      col--;
      maze[row][col].isWall = false;
    }
  }
  
  setMaze([...maze]);
}

