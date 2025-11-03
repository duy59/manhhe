'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/utils/api';
import { formatNumber, formatDate, getMaterialStatusColor, getMaterialStatusText } from '@/utils/helpers';

function MaterialsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [searchTerm, filterStatus, materials]);

  const loadMaterials = async () => {
    try {
      const response = await api.getMaterials();
      if (response.success) {
        setMaterials(response.data);
        setFilteredMaterials(response.data);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((m) => m.status === filterStatus);
    }

    setFilteredMaterials(filtered);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📦 Danh sách nguyên liệu</h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hoặc mã..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="AVAILABLE">Còn hàng</option>
                <option value="LOW_STOCK">Sắp hết</option>
                <option value="OUT_OF_STOCK">Hết hàng</option>
                <option value="EXPIRED">Hết hạn</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Materials Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Mã</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tên nguyên liệu</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Số lượng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Đơn vị</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Tồn tối thiểu</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Hạn sử dụng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Nhà cung cấp</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      Không tìm thấy nguyên liệu nào
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((material) => (
                    <tr
                      key={material.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/materials/${material.id}`)}
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">{material.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{material.name}</div>
                        {material.description && (
                          <div className="text-sm text-gray-500">{material.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-medium ${
                            material.quantity <= material.minQuantity
                              ? 'text-red-600'
                              : 'text-gray-800'
                          }`}
                        >
                          {formatNumber(material.quantity)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{material.unit}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600">
                        {formatNumber(material.minQuantity)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {material.expiryDate ? formatDate(material.expiryDate) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getMaterialStatusColor(
                            material.status
                          )}`}
                        >
                          {getMaterialStatusText(material.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {material.supplier?.name || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Tổng: <span className="font-medium">{filteredMaterials.length}</span> nguyên liệu
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  return (
    <ProtectedRoute>
      <MaterialsContent />
    </ProtectedRoute>
  );
}
