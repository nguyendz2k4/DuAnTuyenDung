import { useEffect, useState, useCallback } from 'react';
import userService from '../../services/userService';
import { API_BASE_URL } from '../../services/apiConfig';

interface UserItem {
  user_id: number;
  full_name: string;
  email: string;
  account_type: string;
  status: number;
  avatar: string | null;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi tải danh sách users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.user_id !== userId));
      alert("🗑️ Đã xóa tài khoản!");
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      alert("⚠️ Không thể xóa tài khoản!");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.account_type === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      Admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Admin' },
      Employer: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Nhà tuyển dụng' },
      JobSeeker: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ứng viên' },
    };
    const badge = badges[role] || { bg: 'bg-gray-100', text: 'text-gray-800', label: role };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          👥 Quản lý người dùng ({filteredUsers.length})
        </h2>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="all">Tất cả</option>
            <option value="Admin">Admin</option>
            <option value="Employer">Nhà tuyển dụng</option>
            <option value="JobSeeker">Ứng viên</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-600">User</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Vai trò</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Trạng thái</th>
              <th className="text-right p-3 text-sm font-medium text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            ) : (
              filteredUsers.map((userItem) => (
                <tr key={userItem.user_id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={userItem.avatar ? `${API_BASE_URL}${userItem.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.full_name || 'User')}&background=random`}
                      alt={userItem.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">{userItem.full_name || 'N/A'}</span>
                  </td>
                  <td className="p-3 text-gray-600">{userItem.email}</td>
                  <td className="p-3">{getRoleBadge(userItem.account_type)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${userItem.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {userItem.status === 1 ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(userItem.user_id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
