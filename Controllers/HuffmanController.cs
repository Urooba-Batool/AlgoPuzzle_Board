using Microsoft.AspNetCore.Mvc;
using AlgoPuzzleBoard.MVC.Services;

namespace AlgoPuzzleBoard.MVC.Controllers
{
    public class HuffmanController : Controller
    {
        private readonly HuffmanService _service;

        public HuffmanController()
        {
            _service = new HuffmanService();
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult BuildTree([FromBody] string text)
        {
            var result = _service.BuildHuffmanTree(text);
            return Json(result);
        }

        [HttpPost]
        public IActionResult Decode([FromBody] DecodeRequest request)
        {
            var decoded = _service.Decode(request.Encoded, request.TreeRoot);
            return Json(new { decoded });
        }

        public class DecodeRequest
        {
            public string Encoded { get; set; } = "";
            public Models.HuffmanTreeNode? TreeRoot { get; set; }
        }
    }
}
