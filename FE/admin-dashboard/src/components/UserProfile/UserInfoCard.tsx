import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "male",
    phone: "",
    address: "",
    bio: "",
    education_level: "",
    experience_years: "",
    skills: "",
  });

  const fetchData = async () => {
    if (!userId) {
      setError("Không tìm thấy userId trong localStorage");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = `http://localhost/DuAnWebTuyenDung/BE/admin/getUserProfile.php?id=${userId}`;
      console.log("UserInfoCard - Đang gọi API:", apiUrl);

      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("UserInfoCard - Response:", data);

      if (data.success) {
        setProfile(data.user);
        setFormData({
          full_name: data.user.full_name || "",
          date_of_birth: data.user.date_of_birth || "",
          gender: data.user.gender || "male",
          phone: data.user.phone || "",
          address: data.user.address || "",
          bio: data.user.bio || "",
          education_level: data.user.education_level || "",
          experience_years: data.user.experience_years || "",
          skills: data.user.skills || "",
        });
      } else {
        throw new Error(data.message || "Không thể tải thông tin");
      }
    } catch (err: any) {
      console.error("UserInfoCard - Lỗi:", err);
      setError(err.message || "Lỗi kết nối API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleSave = async () => {
    try {
      const res = await fetch(
        "http://localhost/DuAnWebTuyenDung/BE/admin/updateUserProfile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, ...formData }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Cập nhật thành công!");
        closeModal();
        fetchData();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi khi update:", err);
      alert("Không thể cập nhật");
    }
  };

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-red-200 rounded-2xl bg-red-50">
        <p className="text-red-700 font-semibold mb-2">⚠️ Lỗi</p>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => fetchData()}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-5 border rounded-2xl text-red-500">Không có dữ liệu</div>;
  }

  // Parse skills từ JSON nếu là job_seeker
  let skillsList: string[] = [];
  if (userRole === "job_seeker" && profile.skills) {
    try {
      skillsList = JSON.parse(profile.skills);
    } catch (e) {
      skillsList = [];
    }
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Thông tin cá nhân
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Họ và tên</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {profile.full_name || profile.username || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Số điện thoại</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {profile.phone || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Ngày sinh</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {profile.date_of_birth
                  ? new Date(profile.date_of_birth).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Giới tính</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {profile.gender === "male"
                  ? "Nam"
                  : profile.gender === "female"
                    ? "Nữ"
                    : profile.gender === "other"
                      ? "Khác"
                      : "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Địa chỉ</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {profile.address || "Chưa cập nhật"}
              </p>
            </div>

            {/* Chỉ hiển thị với job_seeker */}
            {userRole === "job_seeker" && (
              <>
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Trình độ</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {profile.education_level || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Kinh nghiệm</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {profile.experience_years
                      ? `${profile.experience_years} năm`
                      : "Chưa cập nhật"}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Kỹ năng</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.length > 0 ? (
                      skillsList.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium dark:bg-blue-900 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Chưa cập nhật</span>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="col-span-2">
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Giới thiệu bản thân</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {profile.bio || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="rounded-full border border-gray-300 px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          Edit
        </button>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="bg-white p-6 rounded-xl dark:bg-gray-800 max-w-3xl max-h-[85vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Chỉnh sửa thông tin</h3>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Họ và tên</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>

              <div>
                <Label>Ngày sinh</Label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Giới tính</Label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <Label>Số điện thoại</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div>
              <Label>Địa chỉ</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Chỉ hiển thị với job_seeker */}
            {userRole === "job_seeker" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Trình độ học vấn</Label>
                    <Input
                      value={formData.education_level}
                      onChange={(e) =>
                        setFormData({ ...formData, education_level: e.target.value })
                      }
                      placeholder="VD: Đại học - CNTT"
                    />
                  </div>

                  <div>
                    <Label>Số năm kinh nghiệm</Label>
                    <Input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) =>
                        setFormData({ ...formData, experience_years: e.target.value })
                      }
                      placeholder="Nhập số năm"
                    />
                  </div>
                </div>

                <div>
                  <Label>Kỹ năng (cách nhau bởi dấu phẩy)</Label>
                  <Input
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="VD: HTML, CSS, JavaScript, ReactJS"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nhập các kỹ năng cách nhau bởi dấu phẩy
                  </p>
                </div>
              </>
            )}

            <div>
              <Label>Giới thiệu bản thân</Label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                placeholder="Viết vài dòng giới thiệu về bản thân..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={closeModal}>
                Đóng
              </Button>
              <Button onClick={handleSave}>Lưu thay đổi</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}