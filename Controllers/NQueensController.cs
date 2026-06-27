using Microsoft.AspNetCore.Mvc;
using AlgoPuzzleBoard.MVC.Services;

namespace AlgoPuzzleBoard.MVC.Controllers
{
    public class NQueensController : Controller
    {
        private readonly NQueensService _service;

        public NQueensController()
        {
            _service = new NQueensService();
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Solve([FromBody] int n = 8)
        {
            var steps = _service.SolveWithSteps(n);
            return Json(steps);
        }
    }
}
