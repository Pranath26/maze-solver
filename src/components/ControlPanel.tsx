import { Play, RotateCcw, Eraser, Sparkles, Zap, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { Algorithm, GenerationAlgorithm, MazeState, MazeSize, SolverMode } from '../types/maze';

interface ControlPanelProps {
  algorithm: Algorithm;
  generationAlgorithm: GenerationAlgorithm;
  animationDelay: number;
  mazeSize: MazeSize;
  mazeState: MazeState;
  isGenerating: boolean;
  animateGeneration: boolean;
  solverMode: SolverMode;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onGenerationAlgorithmChange: (algorithm: GenerationAlgorithm) => void;
  onAnimationDelayChange: (delay: number) => void;
  onMazeSizeChange: (size: MazeSize) => void;
  onAnimateGenerationChange: (animate: boolean) => void;
  onSolverModeChange: (mode: SolverMode) => void;
  onGenerateMaze: () => void;
  onSolveMaze: () => void;
  onReset: () => void;
  onClear: () => void;
}

const algorithmInfo: Record<Algorithm, { name: string; optimal: boolean }> = {
  astar: { name: 'A* Search', optimal: true },
  dijkstra: { name: "Dijkstra's", optimal: true },
  bfs: { name: 'BFS', optimal: true },
  dfs: { name: 'DFS', optimal: false },
  greedy: { name: 'Greedy', optimal: false },
  bidirectional: { name: 'Bi-BFS', optimal: true },
  bestfirst: { name: 'Best-First', optimal: false },
};

const generationInfo: Record<GenerationAlgorithm, string> = {
  recursive: 'Recursive Backtracking',
  kruskal: "Kruskal's Algorithm",
  prim: "Prim's Algorithm",
  wilson: "Wilson's Algorithm",
  eller: "Eller's Algorithm",
  binarytree: 'Binary Tree',
  sidewinder: 'Sidewinder',
  aldousbroder: 'Aldous-Broder',
  huntandkill: 'Hunt and Kill',
};

export function ControlPanel({
  algorithm,
  generationAlgorithm,
  animationDelay,
  mazeSize,
  mazeState,
  isGenerating,
  animateGeneration,
  solverMode,
  onAlgorithmChange,
  onGenerationAlgorithmChange,
  onAnimationDelayChange,
  onMazeSizeChange,
  onAnimateGenerationChange,
  onSolverModeChange,
  onSolveMaze,
  onGenerateMaze,
  onReset,
  onClear,
}: ControlPanelProps) {
  const isDisabled = mazeState === 'solving' || isGenerating;
  const selectedAlgInfo = algorithmInfo[algorithm];

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Quick Actions */}
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onGenerateMaze}
              disabled={isDisabled}
              size="lg"
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
            <Button
              onClick={onSolveMaze}
              disabled={isDisabled}
              size="lg"
              className="w-full"
              variant="secondary"
            >
              <Play className="mr-2 h-4 w-4" />
              Solve
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onClear}
              disabled={isDisabled}
              variant="outline"
              size="sm"
            >
              <Eraser className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button
              onClick={onReset}
              disabled={isDisabled}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pathfinding Settings */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Pathfinding</CardTitle>
              <CardDescription className="mt-1">
                {selectedAlgInfo.name}
              </CardDescription>
            </div>
            <Badge variant={selectedAlgInfo.optimal ? 'default' : 'secondary'}>
              {selectedAlgInfo.optimal ? 'Optimal' : 'Heuristic'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select
              value={algorithm}
              onValueChange={(value) => onAlgorithmChange(value as Algorithm)}
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="astar">⭐ A* Search</SelectItem>
                <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                <SelectItem value="bfs">Breadth-First Search</SelectItem>
                <SelectItem value="bidirectional">Bidirectional BFS</SelectItem>
                <SelectItem value="dfs">Depth-First Search</SelectItem>
                <SelectItem value="greedy">Greedy Best-First</SelectItem>
                <SelectItem value="bestfirst">Best-First Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={solverMode === 'shortest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSolverModeChange('shortest')}
                disabled={isDisabled}
              >
                Shortest
              </Button>
              <Button
                variant={solverMode === 'fast' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSolverModeChange('fast')}
                disabled={isDisabled}
              >
                <Zap className="mr-1 h-3 w-3" />
                Fast
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maze Generation Settings */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Maze Generation</CardTitle>
          <CardDescription>
            {generationInfo[generationAlgorithm]}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select
              value={generationAlgorithm}
              onValueChange={(value) => onGenerationAlgorithmChange(value as GenerationAlgorithm)}
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recursive">Recursive Backtracking</SelectItem>
                <SelectItem value="prim">Prim's Algorithm</SelectItem>
                <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
                <SelectItem value="eller">Eller's Algorithm</SelectItem>
                <SelectItem value="wilson">Wilson's Algorithm</SelectItem>
                <SelectItem value="binarytree">Binary Tree</SelectItem>
                <SelectItem value="sidewinder">Sidewinder</SelectItem>
                <SelectItem value="aldousbroder">Aldous-Broder</SelectItem>
                <SelectItem value="huntandkill">Hunt and Kill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <Checkbox
              id="animate-gen"
              checked={animateGeneration}
              onCheckedChange={onAnimateGenerationChange}
              disabled={isDisabled}
            />
            <Label htmlFor="animate-gen" className="cursor-pointer">
              Animate generation
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

