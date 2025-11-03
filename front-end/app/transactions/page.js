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
import { formatNumber, formatDateTime, getTransactionTypeColor, getTransactionTypeText, hasRole } from '@/utils/helpers';

function TransactionsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [importForm, setImportForm] = useState({
    materialId: '',
    quantity: '',
    unitPrice: '',
    supplierId: '',
    note: '',
  });

  const [exportForm, setExportForm] = useState({
    materialId: '',
    quantity: '',
    purpose: '',
    note: '',
  });

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transRes, matRes] = await Promise.all([
        api.getTransactions(),
        api.getMaterials(),
      ]);

      if (transRes.success) setTransactions(transRes.data);
      if (matRes.success) setMaterials(matRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      const response = await api.importMaterial({
        materialId: parseInt(importForm.materialId),
        quantity: parseFloat(importForm.quantity),
        unitPrice: parseFloat(importForm.unitPrice),
        supplierId: importForm.supplierId ? parseInt(importForm.supplierId) : null,
        note: importForm.note,
      });

      if (response.success) {
        alert('Nhập kho thành công!');
        setShowImportModal(false);
        setImportForm({ materialId: '', quantity: '', unitPrice: '', supplierId: '', note: '' });
        loadData();
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi nhập kho');
      console.error(error);
    }
  };

  const handleExport = async (e) => {
    e.preventDefault();
    try {
      const response = await api.exportMaterial({
        materialId: parseInt(exportForm.materialId),
        quantity: parseFloat(exportForm.quantity),
        purpose: exportForm.purpose,
        note: exportForm.note,
      });

      if (response.success) {
        alert('Xuất kho thành công!');
        setShowExportModal(false);
        setExportForm({ materialId: '', quantity: '', purpose: '', note: '' });
        loadData();
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi xuất kho');
      console.error(error);
    }
  };

  const canManageTransaction = user && hasRole(user, ['ADMIN', 'WAREHOUSE_STAFF']);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🔄 Lịch sử Nhập - Xuất kho</h1>
          
          {canManageTransaction && (
            <div className="flex space-x-3">
              <Button onClick={() => setShowImportModal(true)} variant="primary">
                📥 Nhập kho
              </Button>
              <Button onClick={() => setShowExportModal(true)} variant="success">
                📤 Xuất kho
              </Button>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Thời gian</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Loại</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Nguyên liệu</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Số lượng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Người thực hiện</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      Chưa có giao dịch nào
                    </td>
                  </tr>
                ) : (
                  transactions.map((trans) => (
                    <tr key={trans.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDateTime(trans.transactionDate)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(
                            trans.type
                          )}`}
                        >
                          {getTransactionTypeText(trans.type)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">
                          {trans.material?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">{trans.material?.code}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${trans.type === 'IMPORT' ? 'text-blue-600' : 'text-purple-600'}`}>
                          {trans.type === 'IMPORT' ? '+' : '-'}{formatNumber(trans.quantity)} {trans.material?.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {trans.employee?.fullName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{trans.note || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Import Modal */}
      <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="📥 Nhập kho">
        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nguyên liệu *
            </label>
            <select
              value={importForm.materialId}
              onChange={(e) => setImportForm({ ...importForm, materialId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Chọn nguyên liệu --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng *
            </label>
            <input
              type="number"
              step="0.01"
              value={importForm.quantity}
              onChange={(e) => setImportForm({ ...importForm, quantity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn giá
            </label>
            <input
              type="number"
              step="0.01"
              value={importForm.unitPrice}
              onChange={(e) => setImportForm({ ...importForm, unitPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={importForm.note}
              onChange={(e) => setImportForm({ ...importForm, note: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setShowImportModal(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              Nhập kho
            </Button>
          </div>
        </form>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} title="📤 Xuất kho">
        <form onSubmit={handleExport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nguyên liệu *
            </label>
            <select
              value={exportForm.materialId}
              onChange={(e) => setExportForm({ ...exportForm, materialId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Chọn nguyên liệu --</option>
              {materials.filter(m => m.status !== 'OUT_OF_STOCK').map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.code}) - Còn: {formatNumber(m.quantity)} {m.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng *
            </label>
            <input
              type="number"
              step="0.01"
              value={exportForm.quantity}
              onChange={(e) => setExportForm({ ...exportForm, quantity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mục đích *
            </label>
            <input
              type="text"
              value={exportForm.purpose}
              onChange={(e) => setExportForm({ ...exportForm, purpose: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ví dụ: Sử dụng cho nhà hàng"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={exportForm.note}
              onChange={(e) => setExportForm({ ...exportForm, note: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setShowExportModal(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="success">
              Xuất kho
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsContent />
    </ProtectedRoute>
  );
}
