using Microsoft.AspNetCore.Mvc;
using AlgoPuzzleBoard.MVC.Services;
using AlgoPuzzleBoard.MVC.Models;

namespace AlgoPuzzleBoard.MVC.Controllers
{
    public class TSPController : Controller
    {
        private readonly TSPService _service;

        public TSPController()
        {
            _service = new TSPService();
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult SolveTSP([FromBody] List<City> cities)
        {
            var result = _service.SolveTSP(cities);
            return Json(result);
        }
    }
}
