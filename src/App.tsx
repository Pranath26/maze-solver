import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { MazeGrid } from './components/MazeGrid';
import { ControlPanel } from './components/ControlPanel';
import { StatsPanel } from './components/StatsPanel';
import { AlgorithmInfo } from './components/AlgorithmInfo';
import { HowToUse } from './components/HowToUse';
import { Legend } from './components/Legend';
import { MazeSettings } from './components/MazeSettings';
import { ComparisonView } from './components/ComparisonView';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { generateMaze } from './utils/mazeGenerator';
import { solveMaze } from './utils/mazeSolver';
import type { Cell, MazeState, Algorithm, GenerationAlgorithm, SolverMode } from './types/maze';

function MainApp() {
  const [viewMode, setViewMode] = useState<'single' | 'comparison'>('single');
  const [mazeSize, setMazeSize] = useState({ rows: 25, cols: 35 });
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [mazeState, setMazeState] = useState<MazeState>('idle');
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [generationAlgorithm, setGenerationAlgorithm] = useState<GenerationAlgorithm>('recursive');
  const [animationDelay, setAnimationDelay] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animateGeneration, setAnimateGeneration] = useState(false);
  const [solverMode, setSolverMode] = useState<SolverMode>('shortest');
  const [hasMazeGenerated, setHasMazeGenerated] = useState(false);
  const [editingMode, setEditingMode] = useState<'start' | 'end' | null>(null);
  const [stats, setStats] = useState({
    visited: 0,
    pathLength: 0,
    time: 0,
    totalCells: 0
  });

  // Initialize maze
  const initializeMaze = useCallback(() => {
    const newMaze: Cell[][] = [];
    for (let row = 0; row < mazeSize.rows; row++) {
      newMaze[row] = [];
      for (let col = 0; col < mazeSize.cols; col++) {
        newMaze[row][col] = {
          row,
          col,
          isWall: true,
          isVisited: false,
          isPath: false,
          isCurrent: false,
          isStart: false,
          isEnd: false,
          distance: Infinity,
          heuristic: 0,
          parent: null
        };
      }
    }
    // Set start and end
    newMaze[1][1].isStart = true;
    newMaze[1][1].isWall = false;
    newMaze[mazeSize.rows - 2][mazeSize.cols - 2].isEnd = true;
    newMaze[mazeSize.rows - 2][mazeSize.cols - 2].isWall = false;
    
    setMaze(newMaze);
    setStats({ visited: 0, pathLength: 0, time: 0, totalCells: mazeSize.rows * mazeSize.cols });
    setHasMazeGenerated(false);
  }, [mazeSize]);

  useEffect(() => {
    initializeMaze();
  }, [initializeMaze]);

  const handleGenerateMaze = async () => {
    setIsGenerating(true);
    setMazeState('generating');
    const startTime = Date.now();
    
    await generateMaze(
      maze,
      setMaze,
      generationAlgorithm,
      animateGeneration ? animationDelay : 0,
      mazeSize
    );
    
    setIsGenerating(false);
    setMazeState('idle');
    const time = Date.now() - startTime;
    setStats(prev => ({ ...prev, time }));
    setHasMazeGenerated(true);
    toast.success(`Maze generated in ${time}ms`);
  };

  const handleSolveMaze = async () => {
    if (mazeState === 'solving') return;
    
    // Auto-generate maze if not already generated
    if (!hasMazeGenerated) {
      toast.info('Generating maze first...');
      await handleGenerateMaze();
    }
    
    // Reset previous solution
    const resetMaze = maze.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: cell.isStart || cell.isEnd ? cell.isVisited : false,
        isPath: false,
        isCurrent: false,
        distance: Infinity,
        parent: null
      }))
    );
    setMaze(resetMaze);
    setStats(prev => ({ ...prev, visited: 0, pathLength: 0 }));
    
    setMazeState('solving');
    const startTime = Date.now();
    
    // findOptimal = true for "shortest" mode, false for "fast" mode
    const result = await solveMaze(
      resetMaze,
      setMaze,
      algorithm,
      animationDelay,
      solverMode === 'shortest'
    );
    
    const time = Date.now() - startTime;
    setStats({
      visited: result.visited,
      pathLength: result.pathLength,
      time,
      totalCells: mazeSize.rows * mazeSize.cols
    });
    
    setMazeState('solved');
    
    if (result.pathLength > 0) {
      toast.success(`Path found! Length: ${result.pathLength}, Visited: ${result.visited} cells`);
    } else {
      toast.error('No path found!');
    }
  };

  const handleReset = () => {
    initializeMaze();
    setMazeState('idle');
  };

  const handleClear = () => {
    const clearedMaze = maze.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false,
        isCurrent: false,
        distance: Infinity,
        parent: null
      }))
    );
    setMaze(clearedMaze);
    setMazeState('idle');
    setStats(prev => ({ ...prev, visited: 0, pathLength: 0, time: 0 }));
  };

  const handleCellClick = (row: number, col: number) => {
    if (mazeState === 'solving' || isGenerating) return;
    
    // Allow editing even on empty maze
    if (!hasMazeGenerated && maze[row][col].isWall) {
      toast.error('Generate a maze first or click on the start/end positions');
      return;
    }
    
    const clickedCell = maze[row][col];
    
    // First click - select what to move
    if (!editingMode) {
      if (clickedCell.isStart) {
        setEditingMode('start');
        toast.info('Click on an open cell to move the start position, or click start again to cancel');
        return;
      }
      if (clickedCell.isEnd) {
        setEditingMode('end');
        toast.info('Click on an open cell to move the end position, or click end again to cancel');
        return;
      }
      return;
    }
    
    // Cancel if clicking the same cell again
    if ((editingMode === 'start' && clickedCell.isStart) || 
        (editingMode === 'end' && clickedCell.isEnd)) {
      setEditingMode(null);
      toast('Move cancelled');
      return;
    }
    
    // Second click - move to new position
    if (clickedCell.isWall) {
      toast.error('Cannot place on a wall. Choose an open cell.');
      return;
    }
    
    if (clickedCell.isStart || clickedCell.isEnd) {
      toast.error('Position already occupied');
      return;
    }
    
    const targetRow = row;
    const targetCol = col;
    
    const newMaze = maze.map(r =>
      r.map(cell => ({
        ...cell,
        isStart: editingMode === 'start' ? (cell.row === targetRow && cell.col === targetCol) : cell.isStart,
        isEnd: editingMode === 'end' ? (cell.row === targetRow && cell.col === targetCol) : cell.isEnd
      }))
    );
    
    setMaze(newMaze);
    toast.success(`${editingMode === 'start' ? 'Start' : 'End'} position moved`);
    setEditingMode(null);
  };

  if (viewMode === 'comparison') {
    return (
      <>
        <Header viewMode={viewMode} onViewModeChange={setViewMode} />
        <ComparisonView />
      </>
    );
  }

  return (
    <>
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />
      
      <div className="container mx-auto px-4 py-6 max-w-[1800px]">
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_320px] gap-6 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Controls */}
          <div className="xl:overflow-y-auto xl:pr-2">
            <ControlPanel
              algorithm={algorithm}
              generationAlgorithm={generationAlgorithm}
              animationDelay={animationDelay}
              mazeSize={mazeSize}
              mazeState={mazeState}
              isGenerating={isGenerating}
              animateGeneration={animateGeneration}
              solverMode={solverMode}
              onAlgorithmChange={setAlgorithm}
              onGenerationAlgorithmChange={setGenerationAlgorithm}
              onAnimationDelayChange={setAnimationDelay}
              onMazeSizeChange={setMazeSize}
              onAnimateGenerationChange={setAnimateGeneration}
              onSolverModeChange={setSolverMode}
              onGenerateMaze={handleGenerateMaze}
              onSolveMaze={handleSolveMaze}
              onReset={handleReset}
              onClear={handleClear}
            />
          </div>

          {/* Center - Maze Display */}
          <div className="flex flex-col min-h-0" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="flex-1 min-h-0">
              <MazeGrid 
                maze={maze} 
                onCellClick={handleCellClick}
                isInteractive={mazeState !== 'solving' && !isGenerating}
                editingMode={editingMode}
              />
            </div>
            {editingMode && (
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/40 rounded-lg text-center animate-pulse">
                <p className="text-sm font-medium">
                  {editingMode === 'start' ? '🟢' : '🔴'} Moving <span className="font-semibold">{editingMode === 'start' ? 'Start' : 'End'}</span> position
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click any open cell to place it • Click {editingMode} again to cancel
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Stats & Info */}
          <div className="space-y-4 xl:overflow-y-auto xl:pl-2">
            <StatsPanel stats={stats} mazeState={mazeState} />
            <MazeSettings
              mazeSize={mazeSize}
              onMazeSizeChange={setMazeSize}
              animationDelay={animationDelay}
              onAnimationDelayChange={setAnimationDelay}
              isDisabled={mazeState === 'solving' || isGenerating}
            />
            <Legend />
            <AlgorithmInfo algorithm={algorithm} />
            <HowToUse />
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        <MainApp />
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}

