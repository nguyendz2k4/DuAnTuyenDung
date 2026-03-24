import { createContext, useContext, useState, useEffect } from "react";

const FavoriteContext = createContext();

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite phải được sử dụng trong FavoriteProvider");
  }
  return context;
};

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteJobs");
    return saved ? JSON.parse(saved) : [];
  });

  // Lưu vào localStorage mỗi khi favorites thay đổi
  useEffect(() => {
    localStorage.setItem("favoriteJobs", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (jobId) => {
    setFavorites((prev) => {
      if (prev.includes(jobId)) {
        // Nếu đã có thì xóa
        return prev.filter((id) => id !== jobId);
      } else {
        // Nếu chưa có thì thêm
        return [...prev, jobId];
      }
    });
  };

  const isFavorite = (jobId) => {
    return favorites.includes(jobId);
  };

  const favoriteCount = favorites.length;

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoriteCount,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};