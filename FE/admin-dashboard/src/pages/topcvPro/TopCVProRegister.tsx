import { useState, useEffect, useCallback } from 'react';
import { FaCrown, FaCheck, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import packageService from '../../services/packageService';

export default function TopCVProRegister() {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { user } = useAuth();
    const userId = user?.userId || '';
    const userEmail = user?.email || '';
    const userName = user?.fullName || 'Người dùng';

    const fetchPackages = useCallback(async () => {
        try {
            const { data } = await packageService.getPackages();

            if (data.success) {
                setPackages(data.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách gói:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const handleSelectPackage = (pkg: { package_id: number; price: string; name: string; duration_days: number; features: string }) => {
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
            const { data } = await packageService.registerPackage({
                user_id: parseInt(userId),
                package_id: selectedPackage.package_id,
                payment_method: paymentMethod,
                amount: selectedPackage.price,
            });

            if (data.success) {
                setShowPaymentModal(false);
                setShowSuccessModal(true);

                // Reset sau 3 giây
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

                {/* User Info */}
                {userId && (
                    <div className="bg-white rounded-xl shadow-md p-4 mb-8 max-w-md mx-auto border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {userName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{userName || 'Người dùng'}</p>
                                <p className="text-sm text-gray-500">{userEmail || 'No email'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Packages Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {packages.map((pkg) => {
                        const features = pkg.features ? JSON.parse(pkg.features) : {};

                        return (
                            <div
                                key={pkg.package_id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
                            >
                                {/* Package Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaCrown className="text-yellow-300" />
                                        <h3 className="text-2xl font-bold">{pkg.name}</h3>
                                    </div>
                                    <p className="text-blue-100 text-sm">{pkg.description}</p>
                                </div>

                                {/* Price */}
                                <div className="p-6 text-center border-b border-gray-100">
                                    <div className="text-4xl font-bold text-gray-800 mb-2">
                                        {parseInt(pkg.price).toLocaleString('vi-VN')}đ
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {pkg.duration_days} ngày sử dụng
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="p-6 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-800">Ưu tiên hiển thị</p>
                                            <p className="text-sm text-gray-600">Priority: {features.priority || 100}</p>
                                        </div>
                                    </div>

                                    {features.auto_pro_post && (
                                        <div className="flex items-start gap-3">
                                            <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-800">Tự động đăng Pro</p>
                                                <p className="text-sm text-gray-600">
                                                    {features.pro_days_per_post} ngày/bài đăng
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-800">Vị trí nổi bật</p>
                                            <p className="text-sm text-gray-600">Xuất hiện trong khu vực TopCV Pro</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-800">Tăng tương tác</p>
                                            <p className="text-sm text-gray-600">Tiếp cận nhiều ứng viên hơn</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
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

                {/* Benefits Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Lợi ích khi sử dụng TopCV Pro
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-blue-600 text-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Hiển thị ưu tiên</h3>
                                <p className="text-gray-600 text-sm">
                                    Tin tuyển dụng của bạn xuất hiện ở vị trí nổi bật, dễ dàng được ứng viên chú ý
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-green-600 text-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Tiếp cận rộng hơn</h3>
                                <p className="text-gray-600 text-sm">
                                    Tăng khả năng tiếp cận ứng viên chất lượng cao, giảm thời gian tuyển dụng
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-purple-600 text-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Tự động hóa</h3>
                                <p className="text-gray-600 text-sm">
                                    Mọi bài đăng trong thời gian gói tự động được đưa vào khu vực Pro
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-orange-600 text-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Hiệu quả cao</h3>
                                <p className="text-gray-600 text-sm">
                                    Tăng tỷ lệ chuyển đổi, nhận được nhiều CV chất lượng hơn
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Modal */}
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
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaCrown className="text-white text-2xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Xác nhận thanh toán
                                </h3>
                                <p className="text-gray-600">Gói: {selectedPackage.name}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Tên gói:</span>
                                    <span className="font-semibold">{selectedPackage.name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Thời hạn:</span>
                                    <span className="font-semibold">{selectedPackage.duration_days} ngày</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t border-gray-200">
                                    <span>Tổng tiền:</span>
                                    <span>{parseInt(selectedPackage.price).toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-3">
                                    Chọn phương thức thanh toán:
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="momo"
                                            checked={paymentMethod === 'momo'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">MoMo</p>
                                            <p className="text-sm text-gray-500">Thanh toán qua ví MoMo</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="bank"
                                            checked={paymentMethod === 'bank'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">Chuyển khoản</p>
                                            <p className="text-sm text-gray-500">Chuyển khoản ngân hàng</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="vnpay"
                                            checked={paymentMethod === 'vnpay'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">VNPay</p>
                                            <p className="text-sm text-gray-500">Thanh toán qua VNPay</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="text-green-500 text-4xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Đăng ký thành công!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Bạn đã đăng ký gói {selectedPackage?.name} thành công.
                            </p>
                            <p className="text-sm text-gray-500">
                                Các bài đăng của bạn sẽ được ưu tiên hiển thị trong {selectedPackage?.duration_days} ngày tới.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}