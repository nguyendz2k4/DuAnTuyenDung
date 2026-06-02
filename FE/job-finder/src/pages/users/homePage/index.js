import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaChevronDown, FaCheck } from "react-icons/fa";

import "./style.scss";
import Pagination from "../../../components/common/Pagination";
import Slider from "../../../components/common/Slider";
import JobCard from "../../../components/common/JobCard";
import { useFavorite } from "../../../context/FavoriteContext";
import jobService from "../../../services/jobService";
import { getImageUrl, logo_default } from "../../../utils/imageUtils";
import {
  FILTER_TYPES,
  LOCATIONS,
  SALARY_OPTIONS,
  EXP_OPTIONS,
  EDUCATION_VALUES,
  DEFAULT_PAGE_SIZE,
} from "../../../utils/constants";

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
  const [companies, setCompanies] = useState([]);
  
  // Loading & Pagination State
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const scrollRef = useRef();

  // --- API CALLS ---

  // Lấy danh sách công ty nổi bật
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await jobService.getCompanies();
        if (data && Array.isArray(data)) {
          const mappedCompanies = data.map(company => ({
            id: company.employerId,
            name: company.companyName,
            logo: company.companyLogo,
            jobCount: company.jobCount,
            industry: company.industry,
          }));
          setCompanies(mappedCompanies);
        }
      } catch (err) {
        console.error("Lỗi tải công ty:", err);
      }
    };
    fetchCompanies();
  }, []);

  // Lấy danh sách việc làm
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryId = filterType === "Ngành nghề" && selectedCategory !== "Tất cả"
          ? categories.find((c) => c.name === selectedCategory)?.id
          : "";

      const params = {
        page,
        limit: DEFAULT_PAGE_SIZE,
        location: filterType === "Địa điểm" && selectedLoc !== "Ngẫu nhiên" ? selectedLoc : "",
        salary: filterType === "Mức lương" && selectedSalary !== "Tất cả" ? selectedSalary : "",
        experience: filterType === "Kinh nghiệm" && !EDUCATION_VALUES.includes(selectedExp) && selectedExp !== "Tất cả" ? selectedExp : "",
        education: filterType === "Kinh nghiệm" && EDUCATION_VALUES.includes(selectedExp) ? selectedExp : "",
        category_id: categoryId || "",
      };

      const res = await jobService.getJobs(params);

      if (res?.success) {
        const mappedJobs = res.data.map(job => ({
          ...job,
          id: job.jobId,
          logo: job.companyLogo,
          company: job.companyName,
          salary: job.salaryRange,
          isPro: job.isPro,
        }));

        setJobs(mappedJobs);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Lỗi tải jobs:", err);
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [page, filterType, selectedLoc, selectedSalary, selectedExp, selectedCategory, categories]);

  // Trigger fetchJobs khi filter thay đổi
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
    if (type === "Địa điểm") setSelectedLoc("Ngẫu nhiên");
  };

  // --- RENDER ---
  return (
    <div className="job-section">
      {/* HEADER */}
      <div className="box-header">
        <div className="box-header-left">
          <div className="box-header-title">Việc làm tốt nhất</div>
          <div className="box-logo-badge">
            <span className="badge-ai-gradient">TopJob SmartMatch AI</span>
          </div>
        </div>
        <div className="box-header-right">
          <span className="box-header-right-text">Xem tất cả</span>
          <div className="box-header-right-icon">
            <IoIosArrowDropleft className="icon-left" size={32} color="#6366f1" />
            <IoIosArrowDropright className="icon-right" size={32} color="#6366f1" />
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
                {FILTER_TYPES.map((opt) => (
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
          
          {filterType === "Địa điểm" && LOCATIONS.map(loc => (
            <button key={loc} className={`tag-btn ${selectedLoc === loc ? "active" : ""}`}
                    onClick={() => { setSelectedLoc(loc); setPage(1); }}>{loc}</button>
          ))}
          
          {filterType === "Mức lương" && SALARY_OPTIONS.map(s => (
            <button key={s} className={`tag-btn ${selectedSalary === s ? "active" : ""}`}
                    onClick={() => { setSelectedSalary(s); setPage(1); }}>{s}</button>
          ))}

          {filterType === "Kinh nghiệm" && EXP_OPTIONS.map(e => (
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container" style={{color: 'red'}}>{error}</div>
      ) : (
        <div className="job-list">
          {jobs.length > 0 ? jobs.map((job, index) => {
             const isLiked = isFavorite(job.id);
             return (
              <JobCard 
                key={job.id} 
                job={job}
                isLiked={isLiked}
                onToggleLike={toggleFavorite}
                style={{ animationDelay: `${index * 0.08}s` }}
              />
            );
          }) : <div className="empty-container">Không tìm thấy công việc nào phù hợp.</div>}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}
                  prevIcon={<IoIosArrowDropleft />} nextIcon={<IoIosArrowDropright />} color="#6366f1" />

      <Slider />

      {/* COMPANY LIST SECTION */}
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
                    <Link to={`/company/${company.id}`} aria-label={`Xem chi tiết ${company.name}`}>
                      {company.name}
                    </Link>
                  </h3>
                  <p className="company-industry">{company.industry}</p>

                  <div className="meta-row">
                    <div className="meta-left">
                      <span className="icon-briefcase" aria-hidden="true">🧳</span>
                      <span className="jobs-count">
                        {company.jobCount || 0} việc làm
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