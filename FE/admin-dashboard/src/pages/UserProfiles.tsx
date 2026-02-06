import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

type UserData = {
  user_id: number;
  username: string;
  email: string;
  role: 'job_seeker' | 'employer' | 'admin';
  status: number;
  created_at: string;
};

export default function UserProfiles() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("userId từ localStorage:", userId);
        if (!userId) {
          throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
        }

        const apiUrl = `http://localhost/DuAnWebTuyenDung/BE/admin/getUserProfile.php?id=${userId}`;
        console.log("Đang gọi API:", apiUrl);

        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Response data:", data);

        if (data.success) {
          setUser(data.user);
        } else {
          throw new Error(data.message || "Không thể lấy thông tin user");
        }
      } catch (err: any) {
        console.error("Lỗi khi lấy profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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

  // --- TRẢ VỀ GIAO DIỆN KHI CÓ DỮ LIỆU ---
  return (
    <>
      <PageMeta
        title={`${user.username} Profile | TailAdmin`}
        description="Trang hồ sơ cá nhân"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Hồ sơ của: {user.username}
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}