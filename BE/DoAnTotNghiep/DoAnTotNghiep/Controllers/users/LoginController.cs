using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep.Controllers.users
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
