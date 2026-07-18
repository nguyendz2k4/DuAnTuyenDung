import React, { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import userService from '../../services/userService';

const AddAccounts = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('password', formData.password);
            const response = await userService.addUser(data);
            const result = response.data;

            if (result.status === 'success' || response.status === 201) {
                setMessage({ type: 'success', text: result.message || 'Tạo tài khoản thành công!' });

                // Reset form sau khi thành công
                setFormData({
                    username: '',
                    email: '',
                    password: ''
                });

            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối đến server!' });
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageMeta title="Thêm tài khoản mới" description="Trang thêm user vào hệ thống" />

            <div className="p-6 max-w-4xl mx-auto">
                <ComponentCard
                    title="Thêm mới tài khoản"
                    desc="Tạo tài khoản quản trị viên. Vai trò được gán an toàn ở phía máy chủ."
                >
                    {/* Hiển thị thông báo */}
                    {message.text && (
                        <div className={`p-4 mb-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        {/* PHẦN 1: THÔNG TIN ĐĂNG NHẬP */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-md font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-2">
                                1. Thông tin đăng nhập
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NÚT BẤM */}
                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                variant="primary"
                                className="px-8 py-2"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Lưu tài khoản Admin'}
                            </Button>
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>Hủy bỏ</Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </>
    );
};

export default AddAccounts;
