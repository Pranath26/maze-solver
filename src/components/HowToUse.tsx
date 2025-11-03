import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, MousePointer2, Sparkles, Play } from 'lucide-react';

export function HowToUse() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <CardTitle className="text-lg">Quick Guide</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1 bg-green-500/10 rounded">
              <Sparkles className="h-3 w-3 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Generate Maze</p>
              <p className="text-xs text-muted-foreground">
                Click Generate to create a new maze with the selected algorithm
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1 bg-blue-500/10 rounded">
              <Play className="h-3 w-3 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Solve Maze</p>
              <p className="text-xs text-muted-foreground">
                Click Solve to visualize the pathfinding algorithm in action
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1 bg-purple-500/10 rounded">
              <MousePointer2 className="h-3 w-3 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Move Start/End</p>
              <p className="text-xs text-muted-foreground">
                Click on the green start or red end cell, then click any open cell to move it
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">💡 Pro Tips:</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Use comparison mode to see algorithm differences</li>
            <li>• Set delay to 0 for instant results</li>
            <li>• Try different modes: Shortest vs Fast</li>
            <li>• Larger mazes show algorithm characteristics better</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

