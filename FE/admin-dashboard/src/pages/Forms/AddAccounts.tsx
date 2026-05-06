import React, { useState, useRef } from 'react';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import userService from '../../services/userService';

const AddAccounts = () => {
    const [role, setRole] = useState('employer');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        companyName: '',
        phone: '',
        website: '',
        address: ''
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
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
            data.append('role', role);

            if (role === 'employer') {
                data.append('companyName', formData.companyName);
                data.append('phone', formData.phone);
                data.append('website', formData.website);
                data.append('address', formData.address);
                if (logoFile) {
                    data.append('logo', logoFile);
                }
            }

            const response = await userService.addUser(data);
            const result = response.data;

            if (result.status === 'success' || response.status === 200) {
                setMessage({ type: 'success', text: result.message || 'Tạo tài khoản thành công!' });

                // Reset form sau khi thành công
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    companyName: '',
                    phone: '',
                    website: '',
                    address: ''
                });
                setLogoFile(null);
                if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file

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
                    desc="Tạo tài khoản cho Quản trị viên hoặc Đối tác tuyển dụng."
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò hệ thống</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                    >
                                        <option value="employer">Nhà tuyển dụng (Employer)</option>
                                        <option value="admin">Quản trị viên (Admin)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* PHẦN 2: THÔNG TIN DOANH NGHIỆP */}
                        {role === 'employer' && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 transition-all duration-300">
                                <h3 className="text-md font-semibold text-blue-800 mb-4 border-l-4 border-blue-600 pl-2">
                                    2. Hồ sơ doanh nghiệp
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Công ty Cổ phần Công nghệ..."
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* --- INPUT LOGO MỚI --- */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo công ty</label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                name="logo"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Định dạng hỗ trợ: JPG, PNG, GIF. (Sẽ lưu vào public/logos)</p>
                                    </div>
                                    {/* ---------------------- */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại liên hệ</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="024 1234 5678"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Website (nếu có)</label>
                                        <input
                                            type="text"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ trụ sở</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Số 1, Đường ABC, Quận XYZ..."
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NÚT BẤM */}
                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                variant="primary"
                                className="px-8 py-2"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : (role === 'employer' ? 'Lưu & Tạo hồ sơ công ty' : 'Lưu tài khoản Admin')}
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