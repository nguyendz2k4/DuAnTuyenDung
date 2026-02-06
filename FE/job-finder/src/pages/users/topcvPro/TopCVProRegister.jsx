import { useState, useEffect } from 'react';
// Đảm bảo bạn đã cài react-icons bên dự án job-finder: npm install react-icons
import { FaCrown, FaCheck, FaTimes, FaCheckCircle } from 'react-icons/fa';

export default function TopCVProRegister() {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Lấy user từ localStorage (hoặc context) bên trang User
    // Ví dụ giả lập, bạn hãy thay bằng logic lấy user thật của dự án User
    const [userId] = useState('7');
    const [userEmail] = useState('Vietthong.pro@gmail.com');
    const [userName] = useState('Nguyễn Viết Thông');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch(
                'http://localhost/DuAnWebTuyenDung/BE/admin/get-packages.php'
            );
            const data = await response.json();
            if (data.success) {
                setPackages(data.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách gói:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);
        setShowPaymentModal(true);
    };

    const handlePayment = async () => {
        if (!userId) {
            alert('⚠️ Vui lòng đăng nhập để đăng ký gói!');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch(
                'http://localhost/DuAnWebTuyenDung/BE/admin/register-package.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: parseInt(userId),
                        package_id: selectedPackage.package_id,
                        payment_method: paymentMethod,
                        amount: selectedPackage.price
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setShowPaymentModal(false);
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    setSelectedPackage(null);
                }, 3000);
            } else {
                alert(`⚠️ ${data.message}`);
            }
        } catch (error) {
            console.error('Lỗi thanh toán:', error);
            alert('⚠️ Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
                        <FaCrown className="text-xl" />
                        <span className="font-semibold">TopCV Pro</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Nâng Tầm Tuyển Dụng
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Đăng ký gói TopCV Pro để ưu tiên hiển thị tin tuyển dụng, tiếp cận ứng viên chất lượng cao hơn
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {packages.map((pkg) => {
                        const features = pkg.features ? JSON.parse(pkg.features) : {};

                        return (
                            <div
                                key={pkg.package_id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaCrown className="text-yellow-300" />
                                        <h3 className="text-2xl font-bold">{pkg.name}</h3>
                                    </div>
                                    <p className="text-blue-100 text-sm">{pkg.description}</p>
                                </div>

                                <div className="p-6 text-center border-b border-gray-100">
                                    <div className="text-4xl font-bold text-gray-800 mb-2">
                                        {parseInt(pkg.price).toLocaleString('vi-VN')}đ
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {pkg.duration_days} ngày sử dụng
                                    </div>
                                </div>

                                <div className="p-6 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-800">Ưu tiên hiển thị</p>
                                            <p className="text-sm text-gray-600">Priority: {features.priority || 100}</p>
                                        </div>
                                    </div>
                                    {/* ... Các feature khác tương tự ... */}
                                    <div className="flex items-start gap-3">
                                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-800">Vị trí nổi bật</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0">
                                    <button
                                        onClick={() => handleSelectPackage(pkg)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        Đăng ký ngay
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal Thanh Toán */}
                {showPaymentModal && selectedPackage && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={24} />
                            </button>

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Xác nhận thanh toán</h3>
                                <p className="text-gray-600">Gói: {selectedPackage.name}</p>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
                            >
                                {isProcessing ? 'Đang xử lý...' : 'Xác nhận ngay'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes scale-in {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
            `}</style>
        </div>
    );
}