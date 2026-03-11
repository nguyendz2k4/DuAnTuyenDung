namespace DoAnTotNghiep.DTO.users
{
    public class PagedResult<T>
    {
        public bool Success { get; set; } = true;
        public List<T> Data { get; set; }
        public PaginationMeta Pagination { get; set; }
        public PagedResult(List<T> data, int page, int limit, int totalItems)
        {
            Data = data;
            Pagination = new PaginationMeta
            {
                CurrentPage = page,
                PerPage = limit,
                TotalJobs = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)limit)
            };
        }
    }

    public class PaginationMeta
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalJobs { get; set; }
        public int PerPage { get; set; }
        public bool HasNext => CurrentPage < TotalPages;
        public bool HasPrev => CurrentPage > 1;
    }
}
