using AlgoPuzzleBoard.MVC.Models;

namespace AlgoPuzzleBoard.MVC.Services
{
    public class HuffmanService
    {
        public class HuffmanNode
        {
            public char Character { get; set; }
            public int Frequency { get; set; }
            public HuffmanNode? Left { get; set; }
            public HuffmanNode? Right { get; set; }
        }

        public HuffmanNode BuildTree(string input)
        {
            var frequencies = input.GroupBy(c => c)
                                   .ToDictionary(g => g.Key, g => g.Count());

            var priorityQueue = new PriorityQueue<HuffmanNode, int>();

            foreach (var kvp in frequencies)
            {
                priorityQueue.Enqueue(new HuffmanNode { Character = kvp.Key, Frequency = kvp.Value }, kvp.Value);
            }

            // Greedy Construction
            while (priorityQueue.Count > 1)
            {
                var left = priorityQueue.Dequeue();
                var right = priorityQueue.Dequeue();

                var parent = new HuffmanNode
                {
                    Character = '*', // Internal node
                    Frequency = left.Frequency + right.Frequency,
                    Left = left,
                    Right = right
                };

                priorityQueue.Enqueue(parent, parent.Frequency);
            }

            return priorityQueue.Dequeue();
        }

        public Dictionary<char, string> GenerateCodes(HuffmanNode root)
        {
            var codes = new Dictionary<char, string>();
            GenerateCodesRecursive(root, "", codes);
            return codes;
        }

        private void GenerateCodesRecursive(HuffmanNode node, string code, Dictionary<char, string> codes)
        {
            if (node == null) return;

            if (node.Left == null && node.Right == null)
            {
                codes[node.Character] = code;
            }

            GenerateCodesRecursive(node.Left, code + "0", codes);
            GenerateCodesRecursive(node.Right, code + "1", codes);
        }
    }
}
