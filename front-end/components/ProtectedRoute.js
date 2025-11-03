'use client';

import { useEffect, useState } from 'react';
import { getToken } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      console.log('🔒 ProtectedRoute - Checking auth, token:', token ? 'EXISTS' : 'NOT FOUND');
      
      if (!token) {
        console.log('❌ No token, redirecting to login...');
        return false;
      }
      
      console.log('✅ Token found, access granted');
      setIsAuthenticated(true);
      setIsChecking(false);
      return true;
    };

    // Đợi một chút để đảm bảo localStorage đã sẵn sàng
    const timer = setTimeout(() => {
      checkAuth();
    }, 50);

    return () => clearTimeout(timer);
  }, [router]);

  if (isChecking) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Loading />;
  }

  return <>{children}</>;
}
