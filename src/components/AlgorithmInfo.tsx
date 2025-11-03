import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Info, Zap, Target, TrendingUp } from 'lucide-react';
import type { Algorithm } from '../types/maze';

interface AlgorithmInfoProps {
  algorithm: Algorithm;
}

const algorithmData: Record<Algorithm, {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimal: boolean;
  complete: boolean;
  speed: 'Very Fast' | 'Fast' | 'Medium' | 'Slow';
}> = {
  astar: {
    name: 'A* Search',
    description: 'Combines actual distance with heuristic estimates to efficiently find the shortest path. Best all-around algorithm.',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    optimal: true,
    complete: true,
    speed: 'Fast'
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description: 'Guarantees shortest path by exploring nodes in order of distance. Works well with weighted graphs.',
    timeComplexity: 'O(V²)',
    spaceComplexity: 'O(V)',
    optimal: true,
    complete: true,
    speed: 'Medium'
  },
  bfs: {
    name: 'Breadth-First Search',
    description: 'Explores all neighbors at current depth before going deeper. Guarantees shortest path in unweighted graphs.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    optimal: true,
    complete: true,
    speed: 'Medium'
  },
  dfs: {
    name: 'Depth-First Search',
    description: 'Explores as far as possible along each branch before backtracking. Very fast but path may not be optimal.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    optimal: false,
    complete: true,
    speed: 'Very Fast'
  },
  greedy: {
    name: 'Greedy Best-First',
    description: 'Uses only the heuristic to guide search towards goal. Fast but may miss optimal path or fail entirely.',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    optimal: false,
    complete: false,
    speed: 'Fast'
  },
  bidirectional: {
    name: 'Bidirectional BFS',
    description: 'Searches from both start and end simultaneously, meeting in the middle. Can be twice as fast as regular BFS.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    optimal: true,
    complete: true,
    speed: 'Fast'
  },
  bestfirst: {
    name: 'Best-First Search',
    description: 'Expands nodes that appear closest to goal based purely on heuristic. Fast but not guaranteed to find path.',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    optimal: false,
    complete: false,
    speed: 'Very Fast'
  }
};

export function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  const info = algorithmData[algorithm];

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-lg">Algorithm Details</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2">{info.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {info.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Time
            </div>
            <code className="text-sm">{info.timeComplexity}</code>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Space
            </div>
            <code className="text-sm">{info.spaceComplexity}</code>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={info.optimal ? 'default' : 'secondary'} className="gap-1">
            {info.optimal ? '✓ Optimal Path' : '✗ Non-optimal'}
          </Badge>
          <Badge variant={info.complete ? 'default' : 'secondary'} className="gap-1">
            {info.complete ? '✓ Complete' : '✗ Incomplete'}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            {info.speed}
          </Badge>
        </div>

        <div className="pt-3 border-t">
          <h4 className="mb-2 text-sm flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            Key Terms
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Optimal:</span> Guarantees shortest path
            </div>
            <div>
              <span className="font-semibold text-foreground">Complete:</span> Always finds a solution if one exists
            </div>
            <div>
              <span className="font-semibold text-foreground">Heuristic:</span> Estimated distance to goal
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

