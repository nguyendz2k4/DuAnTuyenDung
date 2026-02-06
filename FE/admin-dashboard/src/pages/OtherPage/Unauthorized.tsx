import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500">403</h1>
                <h2 className="text-2xl font-semibold mt-4">Không có quyền truy cập</h2>
                <p className="text-gray-600 mt-2">
                    Bạn không có quyền truy cập trang này
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}