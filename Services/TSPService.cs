using AlgoPuzzleBoard.MVC.Models;

namespace AlgoPuzzleBoard.MVC.Services
{
    public class TspService
    {
        public List<int> SolveGreedy(double[][] distances)
        {
            int n = distances.Length;
            if (n == 0) return new List<int>();

            var path = new List<int>();
            var visited = new bool[n];

            // Start at city 0
            int current = 0;
            path.Add(current);
            visited[current] = true;

            for (int i = 0; i < n - 1; i++)
            {
                int next = -1;
                double minDist = double.MaxValue;

                for (int j = 0; j < n; j++)
                {
                    if (!visited[j] && distances[current][j] < minDist)
                    {
                        minDist = distances[current][j];
                        next = j;
                    }
                }

                if (next != -1)
                {
                    visited[next] = true;
                    path.Add(next);
                    current = next;
                }
            }

            // Return to start
            path.Add(path[0]);
            return path;
        }
    }
}
