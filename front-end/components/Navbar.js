'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUser, removeToken } from '@/utils/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Nguyên liệu', path: '/materials', icon: '📦' },
    { name: 'Nhập/Xuất kho', path: '/transactions', icon: '🔄' },
    { name: 'Yêu cầu', path: '/requests', icon: '📝' },
    { name: 'Nhà cung cấp', path: '/suppliers', icon: '🏢' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🏪</span>
            <span className="text-xl font-bold text-gray-800">Quản lý kho</span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User info */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm">
                <div className="font-medium text-gray-800">{user.fullName}</div>
                <div className="text-gray-500 text-xs">{user.role}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
