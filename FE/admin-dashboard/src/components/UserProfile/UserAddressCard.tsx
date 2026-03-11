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

export default function UserAddressCard({ user }: Props) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    companyName: user.companyName ?? "",
    companyWebsite: user.companyWebsite ?? "",
    companyAddress: user.companyAddress ?? "",
    companyPhone: user.companyPhone ?? "",
    description: user.description ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Không phải Employer thì không hiển thị gì
  if (user.accountType !== "Employer") return null;

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7099/api/employer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        closeModal();
        window.location.reload();
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
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Thông tin công ty
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Tên công ty</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user.companyName || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Website</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user.companyWebsite ? (
                    <a
                      href={user.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {user.companyWebsite}
                    </a>
                  ) : "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Ngành nghề</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user.nameIndustry || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Quy mô</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user.companySize || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Địa chỉ công ty</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user.companyAddress || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Số điện thoại</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user.companyPhone || "Chưa cập nhật"}
                </p>
              </div>

              <div className="lg:col-span-2">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Mô tả công ty</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user.description || "Chưa cập nhật"}
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
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa thông tin công ty
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Cập nhật thông tin công ty của bạn.
            </p>
          </div>

          {saveError && (
            <div className="mx-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {saveError}
            </div>
          )}

          <div className="px-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Tên công ty</Label>
                <Input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label>Số điện thoại</Label>
                <Input
                  type="tel"
                  value={formData.companyPhone}
                  onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <Label>Địa chỉ</Label>
                <Input
                  type="text"
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  placeholder="Nhập địa chỉ công ty"
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Mô tả công ty</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  placeholder="Viết mô tả về công ty..."
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
    </>
  );
}