import { useState, useCallback, useEffect } from "react";
import { Play, RotateCcw, Sparkles, Settings } from "lucide-react";
import { MazeGrid } from "./MazeGrid";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { generateMaze } from "../utils/mazeGenerator";
import { solveMaze } from "../utils/mazeSolver";
import type {
  Cell,
  Algorithm,
  GenerationAlgorithm,
  MazeSize,
  SolverMode,
  Stats,
} from "../types/maze";

const algorithmNames: Record<Algorithm, string> = {
  astar: "A* Search",
  dijkstra: "Dijkstra's",
  bfs: "BFS",
  dfs: "DFS",
  greedy: "Greedy",
  bidirectional: "Bi-BFS",
  bestfirst: "Best-First",
};

export function ComparisonView() {
  const [mazeSize, setMazeSize] = useState<MazeSize>({ rows: 25, cols: 35 });
  const [maze1, setMaze1] = useState<Cell[][]>([]);
  const [maze2, setMaze2] = useState<Cell[][]>([]);
  const [algorithm1, setAlgorithm1] = useState<Algorithm>("astar");
  const [algorithm2, setAlgorithm2] = useState<Algorithm>("bfs");
  const [generationAlgorithm, setGenerationAlgorithm] =
    useState<GenerationAlgorithm>("recursive");
  const [animationDelay, setAnimationDelay] = useState(20);
  const [animateGeneration, setAnimateGeneration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [stats1, setStats1] = useState<Stats>({
    visited: 0,
    pathLength: 0,
    time: 0,
    totalCells: 0,
  });
  const [stats2, setStats2] = useState<Stats>({
    visited: 0,
    pathLength: 0,
    time: 0,
    totalCells: 0,
  });
  const [solverMode, setSolverMode] = useState<SolverMode>("shortest");

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
          parent: null,
        };
      }
    }
    newMaze[1][1].isStart = true;
    newMaze[1][1].isWall = false;
    newMaze[mazeSize.rows - 2][mazeSize.cols - 2].isEnd = true;
    newMaze[mazeSize.rows - 2][mazeSize.cols - 2].isWall = false;

    setMaze1(newMaze);
    setMaze2(JSON.parse(JSON.stringify(newMaze)));
    setStats1({
      visited: 0,
      pathLength: 0,
      time: 0,
      totalCells: mazeSize.rows * mazeSize.cols,
    });
    setStats2({
      visited: 0,
      pathLength: 0,
      time: 0,
      totalCells: mazeSize.rows * mazeSize.cols,
    });
  }, [mazeSize]);

  useEffect(() => {
    initializeMaze();
  }, [initializeMaze]);

  const handleGenerateMaze = async () => {
    setIsGenerating(true);

    await generateMaze(
      maze1,
      setMaze1,
      generationAlgorithm,
      animateGeneration ? animationDelay : 0,
      mazeSize
    );

    setMaze2(JSON.parse(JSON.stringify(maze1)));
    setIsGenerating(false);
  };

  const handleSolve = async () => {
    if (isSolving) return;

    // Auto-generate if needed
    const hasWalls = maze1.some((row) =>
      row.some((cell) => !cell.isWall && !cell.isStart && !cell.isEnd)
    );
    if (!hasWalls) {
      await handleGenerateMaze();
    }

    const resetMaze1 = maze1.map((row) =>
      row.map((cell) => ({
        ...cell,
        isVisited: cell.isStart || cell.isEnd ? cell.isVisited : false,
        isPath: false,
        isCurrent: false,
        distance: Infinity,
        parent: null,
      }))
    );
    const resetMaze2 = JSON.parse(JSON.stringify(resetMaze1));

    setMaze1(resetMaze1);
    setMaze2(resetMaze2);
    setIsSolving(true);

    const startTime = Date.now();

    const promise1 = solveMaze(
      resetMaze1,
      setMaze1,
      algorithm1,
      animationDelay,
      solverMode === "shortest"
    ).then((result) => ({
      ...result,
      time: Date.now() - startTime,
    }));

    const startTime2 = Date.now();
    const promise2 = solveMaze(
      resetMaze2,
      setMaze2,
      algorithm2,
      animationDelay,
      solverMode === "shortest"
    ).then((result) => ({
      ...result,
      time: Date.now() - startTime2,
    }));

    const [result1, result2] = await Promise.all([promise1, promise2]);

    setStats1({
      visited: result1.visited,
      pathLength: result1.pathLength,
      time: result1.time,
      totalCells: mazeSize.rows * mazeSize.cols,
    });

    setStats2({
      visited: result2.visited,
      pathLength: result2.pathLength,
      time: result2.time,
      totalCells: mazeSize.rows * mazeSize.cols,
    });

    setIsSolving(false);
  };

  const handleReset = () => {
    initializeMaze();
  };

  const isDisabled = isGenerating || isSolving;

  // Winner is the one with better efficiency (higher percentage)
  const efficiency1 =
    stats1.visited > 0 && stats1.pathLength > 0
      ? (stats1.pathLength / stats1.visited) * 100
      : 0;
  const efficiency2 =
    stats2.visited > 0 && stats2.pathLength > 0
      ? (stats2.pathLength / stats2.visited) * 100
      : 0;

  const winner1 = efficiency1 > 0 && efficiency1 >= efficiency2;
  const winner2 = efficiency2 > 0 && efficiency2 >= efficiency1;

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1800px]">
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-120px)]">
        {/* Control Panel */}
        <div className="space-y-4 xl:overflow-y-auto xl:pr-2">
          <Card className="shadow-lg border-2">
            <CardHeader className="pb-3">
              <CardTitle>Comparison Controls</CardTitle>
              <CardDescription>
                Compare two algorithms side-by-side
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleGenerateMaze}
                  disabled={isDisabled}
                  size="lg"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </Button>
                <Button
                  onClick={handleSolve}
                  disabled={isDisabled}
                  size="lg"
                  variant="secondary"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Solve Both
                </Button>
              </div>

              <Button
                onClick={handleReset}
                disabled={isDisabled}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Maze Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Generation Algorithm</Label>
                <Select
                  value={generationAlgorithm}
                  onValueChange={(value) =>
                    setGenerationAlgorithm(value as GenerationAlgorithm)
                  }
                  disabled={isDisabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recursive">
                      Recursive Backtracking
                    </SelectItem>
                    <SelectItem value="prim">Prim's Algorithm</SelectItem>
                    <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
                    <SelectItem value="eller">Eller's Algorithm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Size</Label>
                <Select
                  value={`${mazeSize.rows}x${mazeSize.cols}`}
                  onValueChange={(value) => {
                    const [rows, cols] = value.split("x").map(Number);
                    setMazeSize({ rows, cols });
                  }}
                  disabled={isDisabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15x21">Small (15×21)</SelectItem>
                    <SelectItem value="25x35">Medium (25×35)</SelectItem>
                    <SelectItem value="35x49">Large (35×49)</SelectItem>
                    <SelectItem value="45x63">XL (45×63)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Checkbox
                  id="animate-gen-comp"
                  checked={animateGeneration}
                  onCheckedChange={(checked) =>
                    setAnimateGeneration(checked as boolean)
                  }
                  disabled={isDisabled}
                />
                <Label
                  htmlFor="animate-gen-comp"
                  className="cursor-pointer text-sm"
                >
                  Animate generation
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <CardTitle className="text-lg">Animation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Delay (ms)</Label>
                <Input
                  type="number"
                  min="0"
                  max="500"
                  step="5"
                  value={animationDelay}
                  onChange={(e) => setAnimationDelay(Number(e.target.value))}
                  disabled={isDisabled}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnimationDelay(0)}
                  disabled={isDisabled}
                >
                  Instant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnimationDelay(20)}
                  disabled={isDisabled}
                >
                  Fast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnimationDelay(50)}
                  disabled={isDisabled}
                >
                  Slow
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={solverMode === "shortest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSolverMode("shortest")}
                    disabled={isDisabled}
                  >
                    Shortest
                  </Button>
                  <Button
                    variant={solverMode === "fast" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSolverMode("fast")}
                    disabled={isDisabled}
                  >
                    Fast
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Algorithm 1 */}
          <div className="flex flex-col h-full">
            <Card className="mb-3 shadow-lg border-2 border-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      Algorithm 1
                    </Label>
                    <Select
                      value={algorithm1}
                      onValueChange={(value) =>
                        setAlgorithm1(value as Algorithm)
                      }
                      disabled={isDisabled}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="astar">A* Search</SelectItem>
                        <SelectItem value="dijkstra">Dijkstra's</SelectItem>
                        <SelectItem value="bfs">BFS</SelectItem>
                        <SelectItem value="bidirectional">Bi-BFS</SelectItem>
                        <SelectItem value="dfs">DFS</SelectItem>
                        <SelectItem value="greedy">Greedy</SelectItem>
                        <SelectItem value="bestfirst">Best-First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {winner1 && stats1.visited > 0 && (
                    <Badge className="ml-2 bg-yellow-500">Winner</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cells Visited:</span>
                  <span className="font-mono">{stats1.visited}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Path Length:</span>
                  <span className="font-mono">{stats1.pathLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    {stats1.visited > 0 && stats1.pathLength > 0
                      ? ((stats1.pathLength / stats1.visited) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
            <div className="flex-1 min-h-0">
              <MazeGrid maze={maze1} title={algorithmNames[algorithm1]} />
            </div>
          </div>

          {/* Algorithm 2 */}
          <div className="flex flex-col h-full">
            <Card className="mb-3 shadow-lg border-2 border-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      Algorithm 2
                    </Label>
                    <Select
                      value={algorithm2}
                      onValueChange={(value) =>
                        setAlgorithm2(value as Algorithm)
                      }
                      disabled={isDisabled}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="astar">A* Search</SelectItem>
                        <SelectItem value="dijkstra">Dijkstra's</SelectItem>
                        <SelectItem value="bfs">BFS</SelectItem>
                        <SelectItem value="bidirectional">Bi-BFS</SelectItem>
                        <SelectItem value="dfs">DFS</SelectItem>
                        <SelectItem value="greedy">Greedy</SelectItem>
                        <SelectItem value="bestfirst">Best-First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {winner2 && stats2.visited > 0 && (
                    <Badge className="ml-2 bg-yellow-500">Winner</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cells Visited:</span>
                  <span className="font-mono">{stats2.visited}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Path Length:</span>
                  <span className="font-mono">{stats2.pathLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-mono">
                    {stats2.visited > 0 && stats2.pathLength > 0
                      ? ((stats2.pathLength / stats2.visited) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
            <div className="flex-1 min-h-0">
              <MazeGrid maze={maze2} title={algorithmNames[algorithm2]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

