import { memo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaChevronDown, FaCheck } from "react-icons/fa";

import logo_title from "../../../assets/imgs/logo/label-toppy-ai.png";
import logo_default from "../../../assets/imgs/logo_cty/conca.jpg"; // Logo mặc định
import "./style.scss";
import Pagination from "../../../components/common/Pagination";
import Slider from "../../../components/common/Slider";
import { useFavorite } from "../../../context/FavoriteContext";

// CẤU HÌNH API URL CHUNG (Dễ sửa đổi sau này)
const API_BASE_URL = "http://192.168.1.4:7099"; 

const HomePage = () => {
  const { toggleFavorite, isFavorite } = useFavorite();
  
  // State quản lý Filters & UI
  const [filterType, setFilterType] = useState("Địa điểm");
  const [openDropdown, setOpenDropdown] = useState(false);
  
  // State lựa chọn Filter
  const [selectedLoc, setSelectedLoc] = useState("Ngẫu nhiên");
  const [selectedSalary, setSelectedSalary] = useState("Tất cả");
  const [selectedExp, setSelectedExp] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Data State
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]); // Đổi sang lấy từ .NET
  
  // Loading & Pagination State
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const scrollRef = useRef();

  // --- CONSTANTS ---
  const locations = ["Ngẫu nhiên", "Hà Nội", "Thành phố Hồ Chí Minh", "Miền Bắc", "Miền Nam"];
  const salaryOptions = ["Tất cả", "10-15 triệu", "15-20 triệu", "20-25 triệu", "25-40 triệu", "Trên 40 triệu", "Thỏa thuận"];
  const expOptions = ["Tất cả", "Chưa có kinh nghiệm", "1 năm trở xuống", "1 năm trở lên", "Đại học", "Cao đẳng"];
  const filterOptions = ["Địa điểm", "Mức lương", "Kinh nghiệm", "Ngành nghề"];

  // --- HELPER: Xử lý ảnh từ .NET ---
  // Giả sử .NET lưu ảnh tên file, cần nối với đường dẫn tĩnh (Static Files)
  const getImageUrl = (imgName) => {
    if (!imgName) return logo_default;
    if (imgName.startsWith("http")) return imgName;
    return `${API_BASE_URL}/images/companies/${imgName}`; // Cần cấu hình Static File ở .NET
  };

  // --- API CALLS ---

  // 1. Lấy danh mục (Categories) từ .NET
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCats(true);
      try {
        // API giả định: GET /api/categories
        const res = await axios.get(`${API_BASE_URL}/api/categories`);
        if (res.data?.success) setCategories(res.data.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Lấy danh sách công ty nổi bật (Companies) từ .NET
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Company`);
        if (res.data && Array.isArray(res.data)) {
          const mappedCompanies = res.data.map(company => ({
            id: company.employerId,
            name: company.companyName,
            logo: company.logo,
            jobCount: company.jobCount,
          }));
          setCompanies(mappedCompanies);
        }
      } catch (err) {
        console.error("Lỗi tải công ty:", err);
      }
    };
    fetchCompanies();
  }, []);

  // 3. Lấy danh sách việc làm (Jobs)
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Logic tìm Category ID
      const categoryId = filterType === "Ngành nghề" && selectedCategory !== "Tất cả"
          ? categories.find((c) => c.name === selectedCategory)?.id
          : "";

      const params = {
        page,
        limit: 12,
        location: filterType === "Địa điểm" && selectedLoc !== "Ngẫu nhiên" ? selectedLoc : "",
        salary: filterType === "Mức lương" && selectedSalary !== "Tất cả" ? selectedSalary : "",
        experience: filterType === "Kinh nghiệm" && !["Đại học", "Cao đẳng"].includes(selectedExp) && selectedExp !== "Tất cả" ? selectedExp : "",
        education: filterType === "Kinh nghiệm" && ["Đại học", "Cao đẳng"].includes(selectedExp) ? selectedExp : "",
        category_id: categoryId || "",
      };

      const res = await axios.get(`${API_BASE_URL}/api/jobs`, { params });

      if (res.data?.success) {
        // Mapping nhẹ nhàng hơn, giữ nguyên các trường quan trọng
        const mappedJobs = res.data.data.map(job => ({
          ...job, // Giữ lại hết các trường gốc để dùng nếu cần
          id: job.jobId,
          logo: job.companyLogo, // Map lại tên cho khớp UI cũ
          company: job.companyName,
          salary: job.salaryRange,
          isPro: job.isPro // Giả sử bên .NET trả về boolean
        }));

        setJobs(mappedJobs);
        setTotalPages(res.data.pagination?.total_pages || 1);
      } else {
        setJobs([]); // Clear jobs nếu không success
      }
    } catch (err) {
      console.error("Lỗi tải jobs:", err);
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchJobs khi filter thay đổi
  useEffect(() => {
    fetchJobs();
  }, [page, filterType, selectedLoc, selectedSalary, selectedExp, selectedCategory]);

  // --- HANDLERS ---
  const scrollList = (direction) => {
    if(scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -700 : 700, behavior: "smooth" });
    }
  };

  const resetFilters = (type) => {
    setFilterType(type);
    setOpenDropdown(false);
    setPage(1);
    // Reset các filter khác về mặc định khi chuyển tab lọc để tránh conflict logic
    if (type === "Địa điểm") setSelectedLoc("Ngẫu nhiên");
    // ... (Tùy logic nghiệp vụ bạn muốn reset hay giữ lại)
  };

  // --- RENDER ---
  return (
    <div className="job-section">
      {/* HEADER */}
      <div className="box-header">
        <div className="box-header-left">
          <div className="box-header-title">Việc làm tốt nhất</div>
          <div className="box-logo"><img src={logo_title} alt="logo" /></div>
        </div>
        <div className="box-header-right">
          <span className="box-header-right-text">Xem tất cả</span>
          <div className="box-header-right-icon">
            <IoIosArrowDropleft className="icon-left" size={32} color="#00b14f" />
            <IoIosArrowDropright className="icon-right" size={32} color="#00b14f" />
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="box-filter">
        <div className="filter-left">
          <IoFilterSharp className="filter-icon" />
          <span className="filter-label">Lọc theo:</span>
          <div className="filter-dropdown">
            <button className="filter-btn" onClick={() => setOpenDropdown(!openDropdown)}>
              {filterType} <FaChevronDown className={`dropdown-icon ${openDropdown ? "rotate" : ""}`} />
            </button>
            {openDropdown && (
              <div className="dropdown-menu">
                {filterOptions.map((opt) => (
                  <div key={opt} className={`dropdown-item ${filterType === opt ? "active" : ""}`} 
                       onClick={() => resetFilters(opt)}>
                    <span>{opt}</span>
                    {filterType === opt && <FaCheck className="check-icon" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FILTER TAGS */}
        <div className="filter-tags">
          <IoIosArrowDropleft className="icon-left" size={32} color="#00b14f" />
          
          {filterType === "Địa điểm" && locations.map(loc => (
            <button key={loc} className={`tag-btn ${selectedLoc === loc ? "active" : ""}`}
                    onClick={() => { setSelectedLoc(loc); setPage(1); }}>{loc}</button>
          ))}
          
          {filterType === "Mức lương" && salaryOptions.map(s => (
            <button key={s} className={`tag-btn ${selectedSalary === s ? "active" : ""}`}
                    onClick={() => { setSelectedSalary(s); setPage(1); }}>{s}</button>
          ))}

          {filterType === "Kinh nghiệm" && expOptions.map(e => (
            <button key={e} className={`tag-btn ${selectedExp === e ? "active" : ""}`}
                    onClick={() => { setSelectedExp(e); setPage(1); }}>{e}</button>
          ))}

          {filterType === "Ngành nghề" && (
            loadingCats ? <span>Đang tải...</span> :
            <>
              <button className={`tag-btn ${selectedCategory === "Tất cả" ? "active" : ""}`}
                      onClick={() => { setSelectedCategory("Tất cả"); setPage(1); }}>Tất cả</button>
              {categories.map(cat => (
                 <button key={cat.id} className={`tag-btn ${selectedCategory === cat.name ? "active" : ""}`}
                         onClick={() => { setSelectedCategory(cat.name); setPage(1); }}>
                   {cat.name} <span className="job-count-badge">({cat.job_count || 0})</span>
                 </button>
              ))}
            </>
          )}
          <IoIosArrowDropright className="icon-right" size={32} color="#00b14f" />
        </div>
      </div>

      {/* JOB LIST */}
      {loading ? (
        <div className="loading-container">Đang tải danh sách...</div>
      ) : error ? (
        <div className="error-container" style={{color: 'red'}}>{error}</div>
      ) : (
        <div className="job-list">
          {jobs.length > 0 ? jobs.map((job, index) => { // <--- 1. THÊM index VÀO ĐÂY
             const isLiked = isFavorite(job.id);
             return (
              <div 
                key={job.id} 
                className={`job-card ${job.isPro ? "card-pro" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }} // <--- 2. ĐẶT STYLE VÀO ĐÂY (Bỏ comment đi)
              >
                <div className="job-logo">
                  <img src={getImageUrl(job.logo)} alt={job.company} onError={(e) => e.target.src = logo_default} />
                </div>
                <div className="job-info">
                  <h3 className="job-title"><Link to={`/job/${job.id}`}>{job.title}</Link></h3>
                  <p className="company-name">
                    {job.isPro && <span className="label-pro">PRO</span>} {job.company}
                  </p>
                  <div className="job-meta">
                    <span className="salary">{job.salary}</span>
                    <span className="location">{job.location}</span>
                  </div>
                </div>
                <button className={`save-icon ${isLiked ? "active" : ""}`} onClick={() => toggleFavorite(job.id)}>
                  {isLiked ? <FaHeart size={20} color="#00b14f" /> : <FaRegHeart size={20} />}
                </button>
              </div>
            );
          }) : <div className="empty-container">Không tìm thấy công việc nào phù hợp.</div>}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}
                  prevIcon={<IoIosArrowDropleft />} nextIcon={<IoIosArrowDropright />} color="#00b14f" />

      <Slider />

      {/* COMPANY LIST SECTION (Footer area) */}
      <div className="section-divider">
        {/* --- PHẦN 1: DANH MỤC NGÀNH NGHỀ (CÓ NÚT SCROLL) --- */}
        <div className="company-list">
          <div className="category-container" ref={scrollRef}>
            <button
              className={`category-btn ${selectedCategory === "Tất cả" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("Tất cả");
                setPage(1);
              }}
            >
              Tất cả
            </button>

            {loadingCats ? (
              <span style={{ padding: "10px", color: "#666" }}>Đang tải...</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setPage(1);
                  }}
                  title={cat.description}
                >
                  {cat.name}
                  {/* Kiểm tra nếu có job_count thì mới hiện */}
                  {(cat.job_count > 0 || cat.jobCount > 0) && (
                    <span className="job-count-badge">
                      ({cat.job_count || cat.jobCount})
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Nút điều hướng Scroll trái phải */}
          <div className="company-header">
            <div className="scroll-controls">
              <button className="scroll-btn" onClick={() => scrollList('left')}>
                <IoIosArrowDropleft />
              </button>
              <button className="scroll-btn" onClick={() => scrollList('right')}>
                <IoIosArrowDropright />
              </button>
            </div>
          </div>
        </div>

        {/* --- PHẦN 2: DANH SÁCH CÔNG TY (CARD CHI TIẾT) --- */}
        <div className="company-list-divider">
          {companies.map((company) => (
            <article key={company.id} className="company-card" aria-labelledby={`company-${company.id}`}>
              <div className="card-inner">
                {/* Cột trái: Logo */}
                <div className="left">
                  <div className="logo-wrap">
                    {/* Sử dụng hàm getImageUrl để load ảnh từ .NET */}
                    <img 
                      src={getImageUrl(company.logo)} 
                      alt={company.name} 
                      onError={(e) => e.target.src = logo_default} 
                    />
                  </div>
                </div>

                {/* Cột giữa: Thông tin */}
                <div className="center">
                  <h3 id={`company-${company.id}`} className="company-title">
                    {/* Dùng Link thay vì a href để không load lại trang */}
                    <Link to={`/company/${company.id}`} aria-label={`Xem chi tiết ${company.name}`}>
                      {company.name}
                    </Link>
                  </h3>
                  <p className="company-industry">{company.industry}</p>

                  <div className="meta-row">
                    <div className="meta-left">
                      <span className="icon-briefcase" aria-hidden="true">🧳</span>
                      {/* Lưu ý: Backend .NET cần trả về trường jobCount hoặc jobs */}
                      <span className="jobs-count">
                        {company.jobCount || company.jobs || 0} việc làm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cột phải: Nút theo dõi */}
                <div className="right">
                  <button className="follow-btn" type="button" aria-pressed="false">
                    + Theo dõi
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);