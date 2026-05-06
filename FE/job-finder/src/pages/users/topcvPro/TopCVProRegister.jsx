import { useState, useEffect } from 'react';
import { FaCrown, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import jobService from '../../../services/jobService';
import { formatCurrency } from '../../../utils/formatters';
import './TopCVProRegister.scss';

export default function TopCVProRegister() {
    const { user } = useAuth();
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const data = await jobService.getPackages();
            if (data?.success) {
                setPackages(data.data);
            } else if (Array.isArray(data)) {
                setPackages(data);
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
        if (!user) {
            alert('⚠️ Vui lòng đăng nhập để đăng ký gói!');
            return;
        }

        setIsProcessing(true);

        try {
            const data = await jobService.registerPackage({
                userId: parseInt(user.id || user.user_id),
                packageId: selectedPackage.package_id || selectedPackage.packageId,
                paymentMethod,
                amount: selectedPackage.price,
            });

            if (data?.success) {
                setShowPaymentModal(false);
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    setSelectedPackage(null);
                }, 3000);
            } else {
                alert(`⚠️ ${data?.message || 'Có lỗi xảy ra'}`);
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
            <div className="topcv-pro-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="topcv-pro-page">
            <div className="topcv-pro-container">
                {/* Header */}
                <div className="pro-header">
                    <div className="pro-badge">
                        <FaCrown className="crown-icon" />
                        <span>TopCV Pro</span>
                    </div>
                    <h1 className="pro-title">Nâng Tầm Tuyển Dụng</h1>
                    <p className="pro-subtitle">
                        Đăng ký gói TopCV Pro để ưu tiên hiển thị tin tuyển dụng, tiếp cận ứng viên chất lượng cao hơn
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="packages-grid">
                    {packages.map((pkg) => {
                        let features = {};
                        try {
                            features = pkg.features ? JSON.parse(pkg.features) : {};
                        } catch { /* ignore */ }

                        return (
                            <div key={pkg.package_id || pkg.packageId} className="package-card">
                                <div className="package-header">
                                    <div className="package-name">
                                        <FaCrown className="crown-icon" />
                                        <h3>{pkg.name}</h3>
                                    </div>
                                    <p className="package-desc">{pkg.description}</p>
                                </div>

                                <div className="package-price">
                                    <div className="price-amount">
                                        {formatCurrency(pkg.price)}
                                    </div>
                                    <div className="price-duration">
                                        {pkg.duration_days || pkg.durationDays} ngày sử dụng
                                    </div>
                                </div>

                                <div className="package-features">
                                    <div className="feature-item">
                                        <FaCheck className="check-icon" />
                                        <div>
                                            <p className="feature-title">Ưu tiên hiển thị</p>
                                            <p className="feature-detail">Priority: {features.priority || 100}</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <FaCheck className="check-icon" />
                                        <div>
                                            <p className="feature-title">Vị trí nổi bật</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="package-action">
                                    <button
                                        onClick={() => handleSelectPackage(pkg)}
                                        className="btn-register-pkg"
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
                    <div className="payment-modal-overlay">
                        <div className="payment-modal">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="close-btn"
                            >
                                <FaTimes size={24} />
                            </button>

                            <div className="modal-body">
                                <h3>Xác nhận thanh toán</h3>
                                <p>Gói: {selectedPackage.name}</p>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="btn-confirm"
                            >
                                {isProcessing ? 'Đang xử lý...' : 'Xác nhận ngay'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="payment-modal-overlay">
                        <div className="payment-modal success">
                            <div className="modal-body">
                                <FaCheck className="success-icon" />
                                <h3>Đăng ký thành công!</h3>
                                <p>Gói của bạn đã được kích hoạt.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}