import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function Legend() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Cell Colors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded shadow-sm border border-green-600" />
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded shadow-sm border border-red-600" />
            <span>End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 dark:bg-purple-600 rounded shadow-sm border border-purple-500 dark:border-purple-700" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded shadow-sm border border-blue-600" />
            <span>Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded shadow-sm border border-yellow-500" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700 dark:bg-slate-950 rounded shadow-sm border border-slate-800 dark:border-black" />
            <span>Wall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white dark:bg-slate-700 rounded shadow-sm border border-slate-200 dark:border-slate-600" />
            <span>Open</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Click start/end cells to move them
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

