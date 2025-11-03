import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Cell } from '../types/maze';

interface MazeGridProps {
  maze: Cell[][];
  title?: string;
  onCellClick?: (row: number, col: number) => void;
  isInteractive?: boolean;
  editingMode?: 'start' | 'end' | null;
}

export function MazeGrid({ maze, title, onCellClick, isInteractive = false, editingMode = null }: MazeGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(12);

  useEffect(() => {
    if (!maze.length || !containerRef.current) return;

    const updateCellSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const rows = maze.length;
      const cols = maze[0]?.length || 0;
      
      // Get available space (with padding)
      const containerWidth = container.clientWidth - 32;
      const containerHeight = container.clientHeight - 32;
      
      // Calculate cell size that fits both dimensions
      const maxCellWidth = Math.floor(containerWidth / cols);
      const maxCellHeight = Math.floor(containerHeight / rows);
      
      // Use the smaller of the two to ensure it fits
      const newCellSize = Math.max(4, Math.min(20, Math.min(maxCellWidth, maxCellHeight)));
      
      setCellSize(newCellSize);
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    
    return () => window.removeEventListener('resize', updateCellSize);
  }, [maze]);

  if (!maze.length) return null;

  const getCellColor = (cell: Cell) => {
    if (cell.isStart) {
      return editingMode === 'start' 
        ? 'bg-green-500 shadow-lg shadow-green-400 ring-2 ring-green-300 animate-pulse' 
        : 'bg-green-500 shadow-sm shadow-green-400';
    }
    if (cell.isEnd) {
      return editingMode === 'end' 
        ? 'bg-red-500 shadow-lg shadow-red-400 ring-2 ring-red-300 animate-pulse' 
        : 'bg-red-500 shadow-sm shadow-red-400';
    }
    if (cell.isCurrent) return 'bg-yellow-400 shadow-sm shadow-yellow-300';
    if (cell.isPath) return 'bg-blue-500 shadow-sm shadow-blue-400';
    if (cell.isVisited) return 'bg-purple-400 dark:bg-purple-600';
    if (cell.isWall) return 'bg-slate-700 dark:bg-slate-950';
    return 'bg-white dark:bg-slate-700';
  };

  const rows = maze.length;
  const cols = maze[0]?.length || 0;

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-xl border shadow-xl"
    >
      {title && (
        <div className="px-4 py-3 border-b bg-background/50 backdrop-blur rounded-t-xl">
          <h3 className="text-center font-semibold">{title}</h3>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="inline-grid gap-[1px] bg-slate-300 dark:bg-slate-800 p-[1px] rounded-lg overflow-hidden shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          }}
        >
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`${getCellColor(cell)} transition-colors duration-100 ${
                  isInteractive && !cell.isWall ? 'cursor-pointer hover:opacity-80' : ''
                }`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.05, delay: (rowIndex + colIndex) * 0.0005 }}
                onClick={() => isInteractive && onCellClick?.(rowIndex, colIndex)}
                style={{
                  width: cellSize,
                  height: cellSize,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

