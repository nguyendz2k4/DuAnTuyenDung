import { useEffect, useState } from "react";
import { User, UserDetail } from "../../type/User";
import { FaTrash, FaEye } from "react-icons/fa";

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [filterRole, setFilterRole] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

    const fetchUsers = async () => {
        const res = await fetch("http://localhost/DuAnWebTuyenDung/BE/admin/user-management.php");
        const data = await res.json();
        if (data.success) setUsers(data.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewDetail = async (userId: number) => {
        const res = await fetch(
            `http://localhost/DuAnWebTuyenDung/BE/admin/user-management.php?user_id=${userId}`
        );
        const data = await res.json();
        if (data.success) {
            setSelectedUser(data.data);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm("Bạn chắc chắn muốn xoá tài khoản?")) return;

        const res = await fetch(
            `http://localhost/DuAnWebTuyenDung/BE/admin/user-management.php`,
            {
                method: "DELETE",
                body: JSON.stringify({ user_id: userId }),
                headers: { "Content-Type": "application/json" },
            }
        );

        const data = await res.json();
        if (data.success) {
            alert("Xoá thành công!");
            fetchUsers();
        } else {
            alert(data.message);
        }
    };

    const filteredUsers = users.filter((u) => {
        const username = u.username ?? "";
        const email = u.email ?? "";
        const role = u.role ?? "";

        const matchRole = filterRole === "all" || role === filterRole;
        const matchSearch =
            username.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase());

        return matchRole && matchSearch;
    });


    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Quản lý tài khoản</h2>

            {/* Bộ lọc + tìm kiếm */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    className="border p-2 rounded"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="all">Tất cả</option>
                    <option value="job_seeker">Người tìm việc</option>
                    <option value="employer">Nhà tuyển dụng</option>
                    <option value="admin">Quản trị viên</option>
                </select>

                <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    placeholder="Tìm theo tên hoặc email..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Bảng danh sách users */}
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Tên</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Vai trò</th>
                            <th className="p-3 text-center">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map((user: User) => (
                            <tr key={user.user_id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    {user.username ?? "Chưa cập nhật"}
                                </td>

                                <td className="p-3">{user.email}</td>
                                <td className="p-3 capitalize">
                                    {user.role ? user.role.replace("_", " ") : "Chưa có role"}
                                </td>


                                <td className="p-3 flex justify-center gap-4">
                                    <button
                                        onClick={() => handleViewDetail(user.user_id)}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                        title="Xem chi tiết"
                                    >
                                        <FaEye size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(user.user_id)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                        title="Xoá tài khoản"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal xem chi tiết */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
                        <h3 className="text-xl font-semibold mb-4">Chi tiết tài khoản</h3>

                        <p><strong>Tên:</strong> {selectedUser.full_name || selectedUser.username}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        <p><strong>SĐT:</strong> {selectedUser.phone || "Không có"}</p>
                        <p><strong>Địa chỉ:</strong> {selectedUser.address || "Không có"}</p>

                        {selectedUser.company_name && (
                            <>
                                <hr className="my-3" />
                                <p><strong>Công ty:</strong> {selectedUser.company_name}</p>
                                <p><strong>Website:</strong> {selectedUser.company_website}</p>
                                <p><strong>Địa chỉ công ty:</strong> {selectedUser.company_address}</p>
                            </>
                        )}

                        <button
                            className="mt-6 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                            onClick={() => setSelectedUser(null)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
