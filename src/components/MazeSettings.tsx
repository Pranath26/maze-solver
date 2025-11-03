import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { MazeSize } from '../types/maze';

interface MazeSettingsProps {
  mazeSize: MazeSize;
  onMazeSizeChange: (size: MazeSize) => void;
  animationDelay: number;
  onAnimationDelayChange: (delay: number) => void;
  isDisabled: boolean;
}

export function MazeSettings({
  mazeSize,
  onMazeSizeChange,
  animationDelay,
  onAnimationDelayChange,
  isDisabled
}: MazeSettingsProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Maze Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Size</Label>
          <Select
            value={`${mazeSize.rows}x${mazeSize.cols}`}
            onValueChange={(value) => {
              const [rows, cols] = value.split('x').map(Number);
              onMazeSizeChange({ rows, cols });
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
              <SelectItem value="45x63">Extra Large (45×63)</SelectItem>
              <SelectItem value="55x77">Huge (55×77)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Animation Speed</Label>
            <span className="text-xs text-muted-foreground">{animationDelay}ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={animationDelay}
            onChange={(e) => onAnimationDelayChange(Number(e.target.value))}
            disabled={isDisabled}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Instant</span>
            <span>Slow</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

