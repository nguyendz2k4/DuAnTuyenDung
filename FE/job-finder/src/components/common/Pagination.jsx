import "./Pagination.scss";
import {
    IoIosArrowDropleft,
    IoIosArrowDropright,
} from "react-icons/io";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    prevIcon = <IoIosArrowDropleft size={32} color="#00b14f" />,     // icon mặc định
    nextIcon = <IoIosArrowDropright size={32} color="#00b14f" />,     // icon mặc định
    color = "#00b14f",  // màu chủ đạo mặc định
}) => {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="pagination" style={{ "--main-color": color }}>
            <button
                className="page-btn"
                onClick={handlePrev}
                disabled={currentPage === 1}
            >
                {prevIcon}
            </button>

            <span className="page-info">
                <span className="current">{currentPage}</span> / {totalPages} trang
            </span>

            <button
                className="page-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                {nextIcon}
            </button>
        </div>
    );
};

export default Pagination;
