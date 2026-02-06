import { useState, useEffect } from "react";
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBill, FaUsers, FaTimes } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import { MdBusinessCenter } from "react-icons/md";
import axios from "axios";

export default function JobPostForm() {
  const getUserId = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      return parseInt(userId);
    }
    return null;
  };

  const [formData, setFormData] = useState({
    user_id: getUserId(),
    title: "",
    requirements: "",
    location: "",
    salary_range: "",
    quantity: "",
    category_id: "",
    education: "",
    level: "",
    work_form: "",
    description: "",
    promote_pro: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<Array<{ name: string; url: string }>>([]);
  const [categories, setCategories] = useState<Array<{ category_id: number; name: string; description: string }>>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  useEffect(() => {
    fetchCategories();
    const currentUserId = getUserId();
    console.log("🔍 User ID from localStorage:", currentUserId);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost/DuAnWebTuyenDung/BE/admin/get-categories.php"
      );

      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        console.error("Lỗi lấy categories:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối API categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
      return;
    }

    setFormData({ ...formData, [name]: e.target.value });
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length === 0) return;

    // Giới hạn tối đa 5 ảnh
    if (images.length + files.length > 5) {
      alert("⚠️ Chỉ được chọn tối đa 5 ảnh!");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`⚠️ File ${file.name} không phải ảnh!`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`⚠️ File ${file.name} quá lớn! (Tối đa 5MB)`);
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;

        setImages((prev) => [...prev, base64String]);
        setImagePreviews((prev) => [...prev, { name: file.name, url: base64String }]);
      };

      reader.onerror = () => {
        alert(`⚠️ Lỗi đọc file ${file.name}`);
      };

      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // Xóa ảnh
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.user_id) {
      alert("⚠️ Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
      return;
    }

    if (!formData.title.trim()) {
      alert("⚠️ Vui lòng nhập tiêu đề công việc!");
      return;
    }

    try {
      const payload = {
        ...formData,
        jobImage: images,
      };

      console.log("📤 Sending data:", payload);

      const response = await axios.post(
        "http://localhost/DuAnWebTuyenDung/BE/admin/job-post.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Response:", response.data);

      if (response.data.success) {
        alert("🎉 Đăng bài thành công!");

        // Reset form
        setFormData({
          user_id: getUserId(),
          title: "",
          requirements: "",
          location: "",
          salary_range: "",
          quantity: "",
          category_id: "",
          education: "",
          level: "",
          work_form: "",
          description: "",
          promote_pro: false,
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        alert(`⚠️ Lỗi: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      console.error("❌ Error Response:", error.response);
      console.error("❌ Error Data:", error.response?.data);

      if (error.response) {
        const errorMsg = error.response.data?.message || JSON.stringify(error.response.data) || "Unknown error";
        alert(`⚠️ Lỗi server: ${errorMsg}`);
      } else if (error.request) {
        alert("⚠️ Không kết nối được server!");
      } else {
        alert(`⚠️ Lỗi: ${error.message}`);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <FaBriefcase className="text-blue-600" /> Đăng bài tuyển dụng
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Tiêu đề công việc <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MdBusinessCenter className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                placeholder="VD: Lập trình viên ReactJS"
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Yêu cầu công việc</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              placeholder="VD: Có kinh nghiệm 1 năm trở lên với ReactJS, biết TypeScript..."
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              rows="3"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Địa điểm</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="VD: TP. Hồ Chí Minh"
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Ảnh đại diện công việc (tối đa 5 ảnh)
            </label>
            <div className="relative">
              <IoImage className="absolute left-3 top-3 text-gray-400 z-10 pointer-events-none" />
              <input
                type="file"
                name="jobImage"
                accept="image/*"
                multiple
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>

            {/* Preview ảnh */}
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes size={12} />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{img.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Toggle TopCV Pro */}
          <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Đăng tin vào TopCV Pro</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  PRO
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Bật để đưa tin vào trang TopCV Pro.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, promote_pro: !prev.promote_pro }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${formData.promote_pro ? "bg-blue-600" : "bg-gray-300"
                }`}
              aria-pressed={!!formData.promote_pro}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${formData.promote_pro ? "translate-x-5" : "translate-x-1"
                  }`}
              />
            </button>
            <input type="hidden" name="promote_pro" value={formData.promote_pro ? "1" : "0"} />
          </label>
        </div>

        {/* Cột phải */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Mức lương</label>
            <div className="relative">
              <FaMoneyBill className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                placeholder="VD: 15 - 25 triệu / tháng"
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Số lượng tuyển</label>
            <div className="relative">
              <FaUsers className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                placeholder="VD: 5"
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Ngành nghề</label>
            <select
              name="category_id"
              value={formData.category_id}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleChange}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? "Đang tải..." : "-- Chọn ngành nghề --"}
              </option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Hình thức làm việc</label>
            <select
              name="work_form"
              value={formData.work_form}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleChange}
            >
              <option value="">-- Chọn hình thức --</option>
              <option value="Full-time">Toàn thời gian</option>
              <option value="Part-time">Bán thời gian</option>
              <option value="Remote">Làm từ xa</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Học vấn yêu cầu</label>
            <select
              name="education"
              value={formData.education}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleChange}
            >
              <option value="">-- Chọn học vấn --</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Cao đẳng">Cao đẳng</option>
              <option value="Đại học">Đại học</option>
              <option value="Sau đại học">Sau đại học</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Cấp bậc</label>
            <select
              name="level"
              value={formData.level}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleChange}
            >
              <option value="">-- Chọn cấp bậc --</option>
              <option value="Thực tập sinh">Thực tập sinh</option>
              <option value="Nhân viên">Nhân viên</option>
              <option value="Trưởng nhóm">Trưởng nhóm</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Giám đốc">Giám đốc</option>
            </select>
          </div>
        </div>

        {/* Toàn hàng: mô tả */}
        <div className="md:col-span-2">
          <label className="block text-gray-600 mb-1 font-medium">Mô tả công việc</label>
          <textarea
            name="description"
            value={formData.description}
            placeholder="Nhập mô tả chi tiết công việc..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            rows="5"
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg shadow transition"
            onClick={() => {
              setFormData({
                user_id: getUserId(),
                title: "",
                requirements: "",
                location: "",
                salary_range: "",
                quantity: "",
                category_id: "",
                education: "",
                level: "",
                work_form: "",
                description: "",
                promote_pro: false,
              });
              setImages([]);
              setImagePreviews([]);
            }}
          >
            🔄 Đặt lại
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-transform transform hover:scale-[1.02]"
          >
            🚀 Đăng bài
          </button>
        </div>
      </form>
    </div>
  );
}