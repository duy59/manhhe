'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api, getUser } from '@/utils/api';
import { formatNumber, formatDateTime, getRequestStatusColor, getRequestStatusText, hasRole } from '@/utils/helpers';

function RequestsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [createForm, setCreateForm] = useState({
    materialId: '',
    requestedQuantity: '',
    reason: '',
  });

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reqRes, matRes] = await Promise.all([
        api.getRequests(),
        api.getMaterials(),
      ]);

      if (reqRes.success) setRequests(reqRes.data);
      if (matRes.success) setMaterials(matRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createRequest({
        materialId: parseInt(createForm.materialId),
        requestedQuantity: parseFloat(createForm.requestedQuantity),
        reason: createForm.reason,
      });

      if (response.success) {
        alert('Tạo yêu cầu thành công!');
        setShowCreateModal(false);
        setCreateForm({ materialId: '', requestedQuantity: '', reason: '' });
        loadData();
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi tạo yêu cầu');
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Xác nhận phê duyệt yêu cầu này?')) return;

    try {
      const response = await api.approveRequest(id);
      if (response.success) {
        alert('Phê duyệt thành công!');
        loadData();
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi phê duyệt');
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      const response = await api.rejectRequest(selectedRequest.id, rejectReason);
      if (response.success) {
        alert('Từ chối thành công!');
        setShowRejectModal(false);
        setSelectedRequest(null);
        setRejectReason('');
        loadData();
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi từ chối');
      console.error(error);
    }
  };

  const canCreateRequest = user && hasRole(user, ['ADMIN', 'KITCHEN_STAFF']);
  const canManageRequest = user && hasRole(user, ['ADMIN', 'WAREHOUSE_STAFF']);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📝 Yêu cầu bổ sung nguyên liệu</h1>

          {canCreateRequest && (
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              ✍️ Tạo yêu cầu mới
            </Button>
          )}
        </div>

        {/* Requests Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Thời gian</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Nguyên liệu</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Số lượng yêu cầu</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Người yêu cầu</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Lý do</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                  {canManageRequest && (
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={canManageRequest ? "7" : "6"} className="text-center py-8 text-gray-500">
                      Chưa có yêu cầu nào
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDateTime(req.requestDate)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">
                          {req.material?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">{req.material?.code}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-800">
                        {formatNumber(req.requestedQuantity)} {req.material?.unit}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {req.requestedBy?.fullName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{req.reason}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(
                            req.status
                          )}`}
                        >
                          {getRequestStatusText(req.status)}
                        </span>
                        {req.status === 'REJECTED' && req.rejectionReason && (
                          <div className="text-xs text-red-600 mt-1">
                            Lý do: {req.rejectionReason}
                          </div>
                        )}
                      </td>
                      {canManageRequest && (
                        <td className="py-3 px-4">
                          {req.status === 'PENDING' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(req.id)}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                ✓ Duyệt
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setShowRejectModal(true);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                ✗ Từ chối
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create Request Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="✍️ Tạo yêu cầu bổ sung">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nguyên liệu *
            </label>
            <select
              value={createForm.materialId}
              onChange={(e) => setCreateForm({ ...createForm, materialId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Chọn nguyên liệu --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.code}) - Còn: {formatNumber(m.quantity)} {m.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng yêu cầu *
            </label>
            <input
              type="number"
              step="0.01"
              value={createForm.requestedQuantity}
              onChange={(e) => setCreateForm({ ...createForm, requestedQuantity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do yêu cầu *
            </label>
            <textarea
              value={createForm.reason}
              onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Ví dụ: Chuẩn bị cho sự kiện lớn..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              Tạo yêu cầu
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedRequest(null);
          setRejectReason('');
        }}
        title="✗ Từ chối yêu cầu"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bạn có chắc muốn từ chối yêu cầu này?
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do từ chối *
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Nhập lý do từ chối..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setSelectedRequest(null);
                setRejectReason('');
              }}
            >
              Hủy
            </Button>
            <Button type="button" variant="danger" onClick={handleReject}>
              Từ chối
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function RequestsPage() {
  return (
    <ProtectedRoute>
      <RequestsContent />
    </ProtectedRoute>
  );
}
