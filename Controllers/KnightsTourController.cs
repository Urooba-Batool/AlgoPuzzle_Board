using Microsoft.AspNetCore.Mvc;
using AlgoPuzzleBoard.MVC.Services;

namespace AlgoPuzzleBoard.MVC.Controllers
{
    public class KnightsTourController : Controller
    {
        private readonly KnightsTourService _service;

        public KnightsTourController()
        {
            _service = new KnightsTourService();
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult SolveTour([FromBody] TourRequest request)
        {
            var path = _service.SolveKnightTour(request.StartRow, request.StartCol);
            return Json(path);
        }

        public class TourRequest
        {
            public int StartRow { get; set; }
            public int StartCol { get; set; }
        }
    }
}
