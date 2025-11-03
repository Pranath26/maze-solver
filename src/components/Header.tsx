import { Moon, Sun, Grid3x3, GitCompare } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  viewMode: 'single' | 'comparison';
  onViewModeChange: (mode: 'single' | 'comparison') => void;
}

export function Header({ viewMode, onViewModeChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Grid3x3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl">Maze Pathfinder</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'single' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('single')}
            >
              Single
            </Button>
            <Button
              variant={viewMode === 'comparison' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('comparison')}
            >
              <GitCompare className="mr-2 h-4 w-4" />
              Compare
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

