'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/utils/api';
import { formatNumber } from '@/utils/helpers';

function DashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    expiredCount: 0,
    pendingRequests: 0,
  });
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [materialsRes, warningsRes, requestsRes] = await Promise.all([
        api.getMaterials(),
        api.getWarnings(),
        api.getPendingRequests(),
      ]);

      if (materialsRes.success) {
        const materials = materialsRes.data;
        setStats({
          totalMaterials: materials.length,
          lowStockCount: materials.filter(m => m.status === 'LOW_STOCK').length,
          outOfStockCount: materials.filter(m => m.status === 'OUT_OF_STOCK').length,
          expiredCount: materials.filter(m => m.status === 'EXPIRED').length,
          pendingRequests: requestsRes.success ? requestsRes.data.length : 0,
        });
      }

      if (warningsRes.success) {
        setWarnings(warningsRes.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng nguyên liệu</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalMaterials}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Sắp hết hàng</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.lowStockCount}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Hết hàng</p>
                <p className="text-3xl font-bold text-red-600">{stats.outOfStockCount}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Yêu cầu chờ</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pendingRequests}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </Card>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <Card title="🔔 Cảnh báo tồn kho" className="mb-8">
            <div className="space-y-3">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    warning.warningType === 'LOW_STOCK'
                      ? 'bg-yellow-50 border-yellow-500'
                      : warning.warningType === 'EXPIRED' || warning.warningType === 'EXPIRING_SOON'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-gray-50 border-gray-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{warning.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{warning.warningMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mã: {warning.code} | Tối thiểu: {formatNumber(warning.minQuantity)} {warning.unit}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      SL: {formatNumber(warning.quantity)} {warning.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card title="⚡ Thao tác nhanh">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/transactions')}
              className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">📥</div>
              <p className="font-medium text-gray-800">Nhập kho</p>
              <p className="text-sm text-gray-600">Cập nhật nhập hàng mới</p>
            </button>

            <button
              onClick={() => router.push('/transactions')}
              className="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">📤</div>
              <p className="font-medium text-gray-800">Xuất kho</p>
              <p className="text-sm text-gray-600">Xuất nguyên liệu sử dụng</p>
            </button>

            <button
              onClick={() => router.push('/requests')}
              className="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">✍️</div>
              <p className="font-medium text-gray-800">Tạo yêu cầu</p>
              <p className="text-sm text-gray-600">Yêu cầu bổ sung nguyên liệu</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
