import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

type UserInfor = {
  fullName: string | null;
  avatar: string | null;
  accountType: string | null;
  status: number | null;
  phone: string | null;
  address: string | null;
  companyName: string | null;
  companyWebsite: string | null;
  companySize: string | null;
  nameIndustry: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  logo: string | null;
  description: string | null;
};

type Props = {
  user: UserInfor;
};

export default function UserInfoCard({ user }: Props) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    fullName: user.fullName ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7099/admin/ProfileUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        closeModal();
        window.location.reload(); // reload để lấy data mới
      } else {
        const data = await res.json();
        setSaveError(data.Message || data.message || "Cập nhật thất bại.");
      }
    } catch {
      setSaveError("Không thể kết nối đến server.");
    } finally {
      setSaving(false);
    }
  };

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
                {user.fullName || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Số điện thoại</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user.phone || "Chưa cập nhật"}
              </p>
            </div>

            <div className="col-span-2">
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Địa chỉ</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user.address || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
        >
          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
          </svg>
          Chỉnh sửa
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa thông tin cá nhân
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Cập nhật thông tin của bạn.
            </p>
          </div>

          {saveError && (
            <div className="mx-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {saveError}
            </div>
          )}

          <div className="px-2">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <Label>Họ và tên</Label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <Label>Số điện thoại</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Địa chỉ</Label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Đóng
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}