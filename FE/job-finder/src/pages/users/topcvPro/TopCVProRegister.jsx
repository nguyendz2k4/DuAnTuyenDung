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
            <div className="topjob-premium-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải danh sách dịch vụ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="topjob-premium-page">
            <div className="topjob-premium-container">
                {/* Header */}
                <div className="pro-header">
                    <div className="pro-badge">
                        <FaCrown className="crown-icon" />
                        <span>TopJob Premium</span>
                    </div>
                    <h1 className="pro-title">Nâng Tầm Tuyển Dụng Vượt Trội</h1>
                    <p className="pro-subtitle">
                        Đăng ký các gói dịch vụ TopJob Premium để tin tuyển dụng của bạn được ưu tiên hiển thị hàng đầu, tiếp cận lượng ứng viên tài năng chất lượng cao nhanh chóng nhất.
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
                                            <p className="feature-title">Ưu tiên hiển thị tin bài</p>
                                            <p className="feature-detail">Priority weight: {features.priority || 100}</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <FaCheck className="check-icon" />
                                        <div>
                                            <p className="feature-title">Nhãn PRO vàng kim nổi bật</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="package-action">
                                    <button
                                        onClick={() => handleSelectPackage(pkg)}
                                        className="btn-register-pkg"
                                    >
                                        Kích hoạt ngay
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
                                <FaTimes size={20} />
                            </button>

                            <div className="modal-body">
                                <h3>Xác nhận kích hoạt gói</h3>
                                <p className="pkg-info">Bạn đã chọn gói: <strong>{selectedPackage.name}</strong></p>
                                <p className="pkg-price">Tổng thanh toán: <strong>{formatCurrency(selectedPackage.price)}</strong></p>
                                
                                <div className="payment-method-select">
                                    <p className="section-label">Phương thức thanh toán:</p>
                                    <div className="methods">
                                        <label className={`method-card ${paymentMethod === 'momo' ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="method" 
                                                value="momo" 
                                                checked={paymentMethod === 'momo'} 
                                                onChange={(e) => setPaymentMethod(e.target.value)} 
                                            />
                                            Ví MoMo
                                        </label>
                                        <label className={`method-card ${paymentMethod === 'atm' ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="method" 
                                                value="atm" 
                                                checked={paymentMethod === 'atm'} 
                                                onChange={(e) => setPaymentMethod(e.target.value)} 
                                            />
                                            Thẻ ATM / Banking
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="btn-confirm"
                            >
                                {isProcessing ? 'Đang kích hoạt...' : 'Xác nhận thanh toán'}
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
                                <h3>Đăng ký Premium thành công!</h3>
                                <p>Gói dịch vụ đã được kích hoạt trên hệ thống TopJob.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}