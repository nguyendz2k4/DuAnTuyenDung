import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import jobService from "../../services/jobService";

const initialForm = { title: "", location: "", salaryRange: "", quantity: "", categoryId: "", requirements: "", description: "" };

export default function EmployerPostJobPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const response = await jobService.getCategories();
      const payload = response?.data ?? response;
      setCategories(payload?.data || payload || []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);
    const employerId = user?.id || user?.userId || user?.user_id;
    if (!employerId) {
      setNotice({ type: "error", text: "Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại." });
      return;
    }

    try {
      const payload = new FormData();
      payload.append("employerId", employerId);
      payload.append("title", form.title);
      payload.append("location", form.location);
      payload.append("salaryRange", form.salaryRange);
      payload.append("quantity", form.quantity);
      payload.append("categoryId", form.categoryId);
      payload.append("requirements", form.requirements);
      payload.append("description", form.description);
      if (file) payload.append("imageFile", file);
      await jobService.createJobPost(payload);
      setForm(initialForm);
      setFile(null);
      setNotice({ type: "success", text: "Tin tuyển dụng đã được gửi thành công." });
    } catch (error) {
      setNotice({ type: "error", text: error?.response?.data?.message || "Không thể tạo tin tuyển dụng. Vui lòng thử lại." });
    }
  };

  return (
    <section>
      <div className="employer-page__heading"><h1>Đăng tin tuyển dụng</h1><p>Tạo tin tuyển dụng mới cho doanh nghiệp của bạn.</p></div>
      <div className="employer-card">
        {notice && <div className={`employer-alert employer-alert--${notice.type}`}>{notice.text}</div>}
        <form className="employer-form" onSubmit={handleSubmit}>
          <div className="employer-form__full"><label htmlFor="title">Tiêu đề công việc *</label><input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label htmlFor="location">Địa điểm</label><input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div><label htmlFor="salary">Mức lương</label><input id="salary" value={form.salaryRange} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} /></div>
          <div><label htmlFor="quantity">Số lượng tuyển</label><input id="quantity" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
          <div><label htmlFor="category">Ngành nghề</label><select id="category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}><option value="">Chọn ngành nghề</option>{categories.map((item) => <option key={item.category_id || item.id} value={item.category_id || item.id}>{item.name}</option>)}</select></div>
          <div className="employer-form__full"><label htmlFor="requirements">Yêu cầu công việc</label><textarea id="requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></div>
          <div className="employer-form__full"><label htmlFor="description">Mô tả công việc</label><textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="employer-form__full"><label htmlFor="image">Ảnh đại diện</label><input id="image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <div className="employer-form__actions"><button className="employer-button" type="submit">Đăng tuyển</button></div>
        </form>
      </div>
    </section>
  );
}
