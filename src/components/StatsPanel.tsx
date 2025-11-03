import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, CheckCircle2, Grid3x3, TrendingUp, Activity } from 'lucide-react';
import type { Stats, MazeState } from '../types/maze';

interface StatsPanelProps {
  stats: Stats;
  mazeState: MazeState;
}

export function StatsPanel({ stats, mazeState }: StatsPanelProps) {
  const getStateColor = () => {
    switch (mazeState) {
      case 'idle': return 'bg-slate-500';
      case 'generating': return 'bg-blue-500';
      case 'solving': return 'bg-yellow-500';
      case 'solved': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getStateText = () => {
    switch (mazeState) {
      case 'idle': return 'Ready';
      case 'generating': return 'Generating...';
      case 'solving': return 'Solving...';
      case 'solved': return 'Solved';
      default: return 'Ready';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <CardTitle className="text-lg">Statistics</CardTitle>
          </div>
          <Badge className={getStateColor()}>
            {getStateText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">Visited</span>
            </div>
            <span className="text-2xl font-mono">{stats.visited}</span>
          </div>

          <div className="flex flex-col p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle2 className="h-3 w-3" />
              <span className="text-xs">Path</span>
            </div>
            <span className="text-2xl font-mono">{stats.pathLength}</span>
          </div>

          <div className="flex flex-col p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs">Time</span>
            </div>
            <span className="text-2xl font-mono">{stats.time}ms</span>
          </div>

          <div className="flex flex-col p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Grid3x3 className="h-3 w-3" />
              <span className="text-xs">Total</span>
            </div>
            <span className="text-2xl font-mono">{stats.totalCells}</span>
          </div>
        </div>

        {stats.visited > 0 && (
          <div className="pt-3 border-t space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cells Explored</span>
                <span className="font-mono">
                  {((stats.visited / stats.totalCells) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min((stats.visited / stats.totalCells) * 100, 100)}%` }}
                />
              </div>
            </div>

            {stats.pathLength > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Search Efficiency</span>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  </div>
                  <span className="font-mono">
                    {((stats.pathLength / stats.visited) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min((stats.pathLength / stats.visited) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.pathLength} of {stats.visited} visited cells used in path
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

