'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken, setUser } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(formData.username, formData.password);

      if (response.success) {
        // Lưu token và thông tin user
        const token = response.data.token; // ✅ Đúng field name từ backend
        const userData = {
          id: response.data.id,
          username: response.data.username,
          fullName: response.data.fullName,
          role: response.data.role,
        };
        
        setToken(token);
        setUser(userData);

        // Log để debug
        console.log('✅ Login successful, token saved:', token ? 'YES' : 'NO');
        console.log('📦 Token value:', token);
        console.log('📦 User data:', userData);

        // Đợi để đảm bảo localStorage được lưu hoàn toàn
        await new Promise(resolve => setTimeout(resolve, 200));

        // Kiểm tra lại token đã được lưu chưa
        const savedToken = localStorage.getItem('token');
        console.log('🔍 Token check after save:', savedToken ? 'EXISTS' : 'NOT FOUND');

        // Chuyển đến dashboard - dùng window.location để force reload
        window.location.replace('/dashboard');
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý kho</h1>
          <p className="text-gray-500 mt-2">Đăng nhập vào hệ thống</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-medium mb-2">Tài khoản demo:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Admin: admin / admin123</li>
            <li>• Warehouse: warehouse1 / warehouse123</li>
            <li>• Kitchen: kitchen1 / kitchen123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
