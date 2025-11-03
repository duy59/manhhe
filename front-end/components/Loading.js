export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}
