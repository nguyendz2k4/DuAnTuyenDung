import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

type UserInfor = {
  fullName: string | null;
  avatar: string | null;
  accountType: string | null;
  status: number | null;
  phone: string | null;
  address: string | null;
  // Nhà tuyển dụng
  companyName: string | null;
  companyWebsite: string | null;
  companySize: string | null;
  nameIndustry: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  logo: string | null;
  description: string | null;
};

export default function UserProfiles() {
  const [user, setUser] = useState<UserInfor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1. Lấy token và userId từ localStorage
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Thay "userId" bằng key thực tế bạn đã lưu

        // 2. Kiểm tra xem các dữ liệu này có tồn tại không
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
        
        if (!userId) {
          throw new Error("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        }

        // 3. Truyền userId vào đường dẫn API bằng backtick (`)
        const res = await fetch(`https://localhost:7099/admin/ProfileUser/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // gửi token lên BE
          },
        });

        if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        }

        if (!res.ok) {
          throw new Error(`Lỗi server: ${res.status}`);
        }

        const data: UserInfor = await res.json();
        setUser(data);

      } catch (err: any) {
        console.error("Lỗi khi lấy profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Không cần truyền id vào dependency array nữa vì nó được lấy trực tiếp bên trong

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold">Đang tải hồ sơ...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-700 mb-2">⚠️ Lỗi</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-500">
            Không tìm thấy dữ liệu người dùng.
          </h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${user.fullName ?? "Người dùng"} | Profile`}
        description="Trang hồ sơ cá nhân"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Hồ sơ của: {user.fullName}
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
          <UserAddressCard user={user} />
        </div>
      </div>
    </>
  );
}