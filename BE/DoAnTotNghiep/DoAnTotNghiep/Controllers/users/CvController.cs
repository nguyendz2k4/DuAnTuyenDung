using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
namespace DoAnTotNghiep.Controllers.users
{
    [ApiController]
    [Route("api/[controller]")]
    public class CvController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public CvController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateCv([FromBody] object cvData)
        {
            // 1. Khởi tạo một "người đưa thư" (HttpClient)
            var client = _httpClientFactory.CreateClient();

            // 2. Chuyển dữ liệu CV sang dạng JSON để gửi đi
            var jsonContent = new StringContent(
                JsonSerializer.Serialize(cvData),
                Encoding.UTF8,
                "application/json"
            );

            try
            {
                // 3. Gửi dữ liệu sang Python Service (Giả sử Python chạy ở port 5000)
                // Bạn sẽ thay đổi URL này khi chúng ta code xong Python
                var response = await client.PostAsync("http://127.0.0.1:5000/process", jsonContent);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Ok(new { message = "Python đã xử lý xong!", data = result });
                }

                return BadRequest("Python Service gặp lỗi khi xử lý.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Không thể kết nối tới Python: {ex.Message}");
            }
        }
    }
}
