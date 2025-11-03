# Maze Pathfinder Visualizer

A beautiful, feature-rich maze generation and pathfinding visualization app built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎯 Pathfinding Algorithms
- **A* Search** - Optimal, uses heuristics for efficiency
- **Dijkstra's Algorithm** - Guaranteed shortest path
- **Breadth-First Search (BFS)** - Optimal for unweighted graphs
- **Bidirectional BFS** - Searches from both ends simultaneously
- **Depth-First Search (DFS)** - Very fast, non-optimal
- **Greedy Best-First** - Fast heuristic-based search
- **Best-First Search** - Pure heuristic approach

### 🌳 Maze Generation Algorithms
- **Recursive Backtracking** - Classic maze generation
- **Prim's Algorithm** - Minimum spanning tree approach
- **Kruskal's Algorithm** - Another MST-based method
- **Eller's Algorithm** - Row-by-row generation
- **Wilson's Algorithm** - Uniform spanning tree
- **Binary Tree** - Simple bias-creating algorithm
- **Sidewinder** - Row-based with interesting patterns
- **Aldous-Broder** - Random walk approach
- **Hunt and Kill** - Hybrid method for natural mazes

### 🎨 User Interface
- **Dark/Light Mode** - Toggle with persistent preference
- **Single View** - Focus on one algorithm with detailed stats
- **Comparison View** - Side-by-side algorithm comparison
- **Responsive Design** - Auto-scaling mazes that fit the screen
- **Interactive Editing** - Click to move start and end positions
- **Real-time Statistics** - Track visited cells, path length, efficiency
- **Algorithm Information** - Detailed complexity and behavior info
- **Quick Guide** - Built-in tips and usage instructions

### ⚡ Performance & Controls
- **Customizable Animation Speed** - Set delay in milliseconds (0-1000ms)
- **Quick Presets** - Instant, Fast, Medium, Slow
- **Solver Modes** - Shortest Path or Fast Path (any solution)
- **Auto-generation** - Automatically generates maze before solving
- **Instant Generation** - Skip animation for immediate results
- **Path Guarantee** - Ensures valid path from start to end

### 📊 Statistics & Metrics
- Cells visited during search
- Final path length
- Execution time
- Cells explored (% of total maze)
- **Search Efficiency** - What % of visited cells ended up in the final path
  - Higher is better (e.g., A* at 55% vs BFS at 20%)
  - Shows how "focused" the algorithm was
- Visual progress bars
- Comparison winner indicators

## 🎮 Usage

### Single View Mode
1. Select a maze generation algorithm
2. Choose maze size (Small to Huge)
3. Click "Generate" to create a maze
4. (Optional) Move start/end positions:
   - Click on the green start cell
   - Click on any open cell to move it
   - Repeat for red end cell
5. Select a pathfinding algorithm
6. Choose solver mode (Shortest or Fast)
7. Adjust animation speed (0-1000ms)
8. Click "Solve" to visualize the algorithm

### Comparison Mode
1. Click "Compare" in the header
2. Generate a maze
3. Select two different algorithms
4. Click "Solve Both" to run them side-by-side
5. Compare statistics and performance

## 🎨 Color Legend
- 🟢 **Green** - Start position
- 🔴 **Red** - End position
- 🟣 **Purple** - Visited cells
- 🔵 **Blue** - Final path
- 🟡 **Yellow** - Currently exploring
- ⬜ **Light/Dark Gray** - Open passage
- ⬛ **Dark Gray** - Wall

## 🚀 Technical Features
- Built with React 18+ and TypeScript
- Styled with Tailwind CSS v4
- Motion animations for smooth transitions
- Auto-scaling grid system
- Batched UI updates for performance
- Toast notifications for user feedback
- Persistent theme preferences

## 📝 Notes
- Mazes automatically scale to fit the viewport
- All mazes guarantee a valid path from start to end
- Animation can be disabled for instant generation
- Comparison mode runs algorithms in parallel
- Stats update in real-time during solving
