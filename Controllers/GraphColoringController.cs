using Microsoft.AspNetCore.Mvc;
using AlgoPuzzleBoard.MVC.Services;
using AlgoPuzzleBoard.MVC.Models;

namespace AlgoPuzzleBoard.MVC.Controllers
{
    public class GraphColoringController : Controller
    {
        private readonly GraphColoringService _service;

        public GraphColoringController()
        {
            _service = new GraphColoringService();
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GenerateGraph([FromBody] int nodeCount = 0)
        {
            var graph = _service.GenerateRandomGraph(nodeCount);
            return Json(graph);
        }

        [HttpPost]
        public IActionResult SolveColoring([FromBody] Graph graph)
        {
            var coloredGraph = _service.SolveGreedyColoring(graph);
            return Json(coloredGraph);
        }

        [HttpPost]
        public IActionResult CheckConflicts([FromBody] Graph graph)
        {
            var conflicts = _service.CheckConflicts(graph);
            return Json(new { conflicts });
        }
    }
}
