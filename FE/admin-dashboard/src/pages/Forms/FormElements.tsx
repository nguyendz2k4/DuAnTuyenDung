import { useState, useEffect, useCallback } from "react";
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBill, FaUsers, FaTimes } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import { MdBusinessCenter } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import jobService from "../../services/jobService";

interface Category {
  category_id: number;
  name: string;
  description: string;
}

export default function JobPostForm() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<{ name: string; url: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await jobService.getCategories();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Lỗi kết nối API categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(`⚠️ File ${file.name} không phải ảnh!`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(`⚠️ File ${file.name} quá lớn! (Tối đa 5MB)`);
      return;
    }

    setImageFile(file);
    setImagePreview({ name: file.name, url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
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
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.userId) {
      alert("⚠️ Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
      return;
    }

    if (!formData.title.trim()) {
      alert("⚠️ Vui lòng nhập tiêu đề công việc!");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("employerId", user.userId);
      payload.append("title", formData.title);
      payload.append("requirements", formData.requirements);
      payload.append("location", formData.location);
      payload.append("salaryRange", formData.salary_range);
      payload.append("quantity", formData.quantity);
      payload.append("categoryId", formData.category_id);
      payload.append("education", formData.education);
      payload.append("level", formData.level);
      payload.append("workForm", formData.work_form);
      payload.append("description", formData.description);
      payload.append("isFeatured", formData.promote_pro ? "true" : "false");
      if (imageFile) {
        payload.append("imageFile", imageFile);
      }

      const { data } = await jobService.createJobPost(payload);

      if (data.message) {
        alert("🎉 Đăng bài thành công!");
        resetForm();
      }
    } catch (error: unknown) {
      console.error("❌ Error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosErr = error as { response?: { data?: { message?: string; Message?: string } } };
        const errorMsg = axiosErr.response?.data?.message || axiosErr.response?.data?.Message || "Lỗi không xác định";
        alert(`⚠️ Lỗi server: ${errorMsg}`);
      } else {
        alert("⚠️ Không kết nối được server!");
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
              rows={3}
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
              Ảnh đại diện công việc
            </label>
            <div className="relative">
              <IoImage className="absolute left-3 top-3 text-gray-400 z-10 pointer-events-none" />
              <input
                type="file"
                name="jobImage"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>

            {imagePreview && (
              <div className="mt-3 relative group inline-block">
                <img
                  src={imagePreview.url}
                  alt={imagePreview.name}
                  className="w-32 h-24 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={12} />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">{imagePreview.name}</p>
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
            rows={5}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg shadow transition"
            onClick={resetForm}
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