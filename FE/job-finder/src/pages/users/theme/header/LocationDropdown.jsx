import { useState, useEffect } from "react";
import "./LocationDropdown.scss";
import myicon from "../../../../assets/imgs/icons/category-empty-children-dropdown.png";

const LocationDropdown = ({ onClose }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const [search, setSearch] = useState("");

    // Gọi API lấy danh sách tỉnh/thành
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then((res) => res.json())
            .then((data) => setProvinces(data))
            .catch((err) => console.error("Lỗi lấy tỉnh:", err));
    }, []);

    // Khi chọn tỉnh -> gọi API lấy quận/huyện
    const handleSelectProvince = (province) => {
        setSelectedProvince(province);
        setSelectedDistricts([]);
        fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
            .then((res) => res.json())
            .then((data) => setDistricts(data.districts))
            .catch((err) => console.error("Lỗi lấy huyện:", err));
    };

    const toggleDistrict = (district) => {
        setSelectedDistricts((prev) =>
            prev.includes(district)
                ? prev.filter((d) => d !== district)
                : [...prev, district]
        );
    };

    const clearAll = () => {
        setSelectedProvince(null);
        setSelectedDistricts([]);
        setDistricts([]);
    };

    // Hàm bỏ dấu tiếng Việt
    const removeVietnameseTones = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    // Tạo danh sách lọc thông minh hơn
    const filteredProvinces = provinces.filter((p) => {
        const cleanName = removeVietnameseTones(p.name.toLowerCase().replace("tinh ", "").replace("thanh pho ", ""));
        const cleanSearch = removeVietnameseTones(search.toLowerCase());
        return cleanName.includes(cleanSearch);
    });


    return (
        <div className="location-dropdown" onClick={(e) => e.stopPropagation()}>
            {/* Cột trái - Tỉnh/Thành phố */}
            <div className="province-column">
                <div className="province-search">
                    <input
                        type="text"
                        placeholder="Nhập Tỉnh/Thành phố"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="province-list">
                    {filteredProvinces.map((prov) => (
                        <div
                            key={prov.code}
                            className={`province-item ${selectedProvince?.code === prov.code ? "active" : ""
                                }`}
                            onClick={() => handleSelectProvince(prov)}
                        >
                            {prov.name}
                            <span className="arrow">›</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột phải - Quận/Huyện */}
            <div className="district-column">
                {selectedProvince ? (
                    <div className="district-list">
                        <h4>{selectedProvince.name}</h4>
                        {districts.map((d) => (
                            <label key={d.code} className="district-item">
                                <input
                                    type="checkbox"
                                    checked={selectedDistricts.includes(d.name)}
                                    onChange={() => toggleDistrict(d.name)}
                                />
                                <span>{d.name}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="empty-placeholder">
                        <img
                            src={myicon}
                            alt="Chọn tỉnh/thành"
                        />
                        <p>Vui lòng chọn Tỉnh/Thành phố</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="dropdown-footer">
                <button className="clear-btn" onClick={clearAll}>
                    Bỏ chọn tất cả
                </button>
                <button className="apply-btn" onClick={onClose}>
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default LocationDropdown;
