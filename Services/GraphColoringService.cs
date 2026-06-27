using AlgoPuzzleBoard.MVC.Models;

namespace AlgoPuzzleBoard.MVC.Services
{
    public class GraphColoringService
    {
        // Simple Greedy Coloring Algorithm
        // Returns dictionary of nodeIndex -> colorIndex
        public Dictionary<int, int> SolveGreedy(int[][] adjacencyMatrix)
        {
            int n = adjacencyMatrix.Length;
            var result = new Dictionary<int, int>();
            var available = new bool[n]; // Tracks used colors

            // Assign first color to first node
            result[0] = 0;

            // Initialize remaining as unassigned
            for (int i = 1; i < n; i++)
                result[i] = -1;

            // Assign colors to remaining nodes
            for (int u = 1; u < n; u++)
            {
                // Process all adjacent vertices and flag their colors as unavailable
                for (int i = 0; i < n; i++) available[i] = true; // reset

                for (int v = 0; v < n; v++)
                {
                    if (adjacencyMatrix[u][v] == 1 && result.ContainsKey(v) && result[v] != -1)
                    {
                        if (result[v] < n) 
                            available[result[v]] = false; 
                    }
                }

                // Find the first available color
                int cr;
                for (cr = 0; cr < n; cr++)
                {
                    if (available[cr]) break;
                }

                result[u] = cr;
            }

            return result;
        }
    }
}
