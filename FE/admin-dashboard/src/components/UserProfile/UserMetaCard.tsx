// components/UserProfile/UserMetaCard.tsx

type UserData = {
  user_id: number;
  username: string;
  email: string;
  role: 'job_seeker' | 'employer' | 'admin';
  status: number;
  created_at: string;
};

type Props = {
  user: UserData;
};

export default function UserMetaCard({ user }: Props) {
  // Chuyển đổi role sang tiếng Việt
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'employer':
        return 'Nhà tuyển dụng';
      case 'job_seeker':
        return 'Người tìm việc';
      default:
        return role;
    }
  };

  // Chuyển đổi status
  const getStatusLabel = (status: number) => {
    return status === 1 ? 'Đang hoạt động' : 'Vô hiệu hóa';
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>

        {/* Thông tin cơ bản */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.username}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vai trò</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {getRoleLabel(user.role)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trạng thái</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.status === 1
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}
          >
            {getStatusLabel(user.status)}
          </span>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày tạo</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatDate(user.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}