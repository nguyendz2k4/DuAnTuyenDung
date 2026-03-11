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

export default function UserMetaCard({ user }: Props) {
  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "Admin": return "Quản trị viên";
      case "Employer": return "Nhà tuyển dụng";
      case "JobSeeker": return "Người tìm việc";
      default: return role ?? "Không xác định";
    }
  };

  const getStatusLabel = (status: number | null) => {
    return status === 1 ? "Đang hoạt động" : "Vô hiệu hóa";
  };

  const avatarSrc = user.avatar || user.logo || null;
  const displayName = user.fullName ?? "Người dùng";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar */}
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {displayName}
          </h2>
          {user.accountType === "Employer" && user.companyName && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.companyName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vai trò</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {getRoleLabel(user.accountType)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trạng thái</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.status === 1
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
          >
            {getStatusLabel(user.status)}
          </span>
        </div>
      </div>
    </div>
  );
}