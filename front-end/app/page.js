'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Đợi một chút để đảm bảo localStorage đã sẵn sàng
    const timer = setTimeout(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('🏠 Home page - Token check:', token ? 'EXISTS' : 'NOT FOUND');
      
      if (token) {
        console.log('→ Redirecting to dashboard');
        window.location.replace('/dashboard');
      } else {
        console.log('→ Redirecting to login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
    </div>
  );
}
