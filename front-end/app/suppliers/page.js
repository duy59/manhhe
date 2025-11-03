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
import { hasRole } from '@/utils/helpers';

function SuppliersContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    taxCode: '',
    note: '',
  });

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchTerm, suppliers]);

  const loadSuppliers = async () => {
    try {
      const response = await api.getSuppliers();
      if (response.success) {
        setSuppliers(response.data);
        setFilteredSuppliers(response.data);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    if (searchTerm) {
      const filtered = suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.phone.includes(searchTerm)
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers(suppliers);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingSupplier) {
        response = await api.updateSupplier(editingSupplier.id, form);
      } else {
        response = await api.createSupplier(form);
      }

      if (response.success) {
        alert(editingSupplier ? 'Cập nhật thành công!' : 'Thêm nhà cung cấp thành công!');
        setShowModal(false);
        resetForm();
        loadSuppliers();
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi lưu nhà cung cấp');
      console.error(error);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      code: supplier.code,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address || '',
      taxCode: supplier.taxCode || '',
      note: supplier.note || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) return;

    try {
      const response = await api.deleteSupplier(id);
      if (response.success) {
        alert('Xóa thành công!');
        loadSuppliers();
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi xóa');
      console.error(error);
    }
  };

  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      taxCode: '',
      note: '',
    });
    setEditingSupplier(null);
  };

  const canManageSupplier = user && hasRole(user, ['ADMIN', 'WAREHOUSE_STAFF']);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🏢 Danh sách nhà cung cấp</h1>

          {canManageSupplier && (
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              variant="primary"
            >
              ➕ Thêm nhà cung cấp
            </Button>
          )}
        </div>

        {/* Search */}
        <Card className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên, mã hoặc số điện thoại..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Card>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Không tìm thấy nhà cung cấp nào
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <Card key={supplier.id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">Mã: {supplier.code}</p>
                    </div>
                    {supplier.active ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        Ngừng
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="mr-2">👤</span>
                      <span>{supplier.contactPerson}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">📞</span>
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">✉️</span>
                      <span className="break-all">{supplier.email}</span>
                    </div>
                    {supplier.address && (
                      <div className="flex items-start">
                        <span className="mr-2">📍</span>
                        <span>{supplier.address}</span>
                      </div>
                    )}
                    {supplier.taxCode && (
                      <div className="flex items-start">
                        <span className="mr-2">🏛️</span>
                        <span>MST: {supplier.taxCode}</span>
                      </div>
                    )}
                  </div>

                  {supplier.note && (
                    <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Ghi chú:</strong> {supplier.note}
                    </div>
                  )}

                  {canManageSupplier && (
                    <div className="flex space-x-2 pt-3 border-t">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingSupplier ? '✏️ Cập nhật nhà cung cấp' : '➕ Thêm nhà cung cấp'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã nhà cung cấp *
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={editingSupplier !== null}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên nhà cung cấp *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người liên hệ *
              </label>
              <input
                type="text"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mã số thuế</label>
            <input
              type="text"
              value={form.taxCode}
              onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              {editingSupplier ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <ProtectedRoute>
      <SuppliersContent />
    </ProtectedRoute>
  );
}
