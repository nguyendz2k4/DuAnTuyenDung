import { API_HOST } from "../services/api";

// Logo mặc định khi không có ảnh
import logo_default from "../assets/imgs/logo_cty/conca.jpg";

/**
 * Xử lý URL ảnh từ .NET backend
 * Hàm này gom logic đang bị copy-paste ở 3+ file (homePage, detailJob, favoriteJobs)
 * 
 * @param {string} imagePath - Tên file hoặc URL đầy đủ
 * @param {string} folder - Thư mục chứa ảnh trên server (mặc định: "images/companies")
 * @returns {string} URL đầy đủ của ảnh
 */
export const getImageUrl = (imagePath, folder = "images/companies") => {
  if (!imagePath) return logo_default;
  if (imagePath.startsWith("http")) return imagePath;
  // Nối với host .NET để tạo URL đầy đủ
  const cleanPath = String(imagePath).trim().replace(/^\//, "");
  return `${API_HOST}/${folder}/${cleanPath}`;
};

/**
 * Resolve URL từ path tương đối sang URL tuyệt đối
 * Dùng cho ảnh gallery, logo job detail...
 * 
 * @param {string} path - Đường dẫn cần resolve
 * @returns {string} URL đầy đủ
 */
export const resolveImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150?text=No+Image";
  const cleanPath = String(path).trim();
  if (cleanPath.startsWith("http")) return cleanPath;
  return `${API_HOST}/${cleanPath.replace(/^\//, "")}`;
};

export { logo_default };
