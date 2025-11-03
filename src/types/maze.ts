export interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  isCurrent: boolean;
  isStart: boolean;
  isEnd: boolean;
  distance: number;
  heuristic: number;
  parent: Cell | null;
}

export type MazeState = 'idle' | 'generating' | 'solving' | 'solved';

export type Algorithm = 
  | 'dfs' 
  | 'bfs' 
  | 'astar' 
  | 'dijkstra' 
  | 'greedy' 
  | 'bidirectional'
  | 'bestfirst';

export type GenerationAlgorithm = 
  | 'recursive' 
  | 'kruskal' 
  | 'prim' 
  | 'wilson' 
  | 'eller'
  | 'binarytree'
  | 'sidewinder'
  | 'aldousbroder'
  | 'huntandkill';

export type SolverMode = 'shortest' | 'fast';

export interface MazeSize {
  rows: number;
  cols: number;
}

export interface SolveResult {
  visited: number;
  pathLength: number;
}

export interface Stats {
  visited: number;
  pathLength: number;
  time: number;
  totalCells: number;
}

export interface ComparisonStats {
  algorithm: Algorithm;
  stats: Stats;
}

