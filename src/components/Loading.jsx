import React from 'react';

export default function Loading() {
  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center animate-scale-in">
      <div className="relative mx-auto w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">กำลังโหลดเรื่อง...</p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">กรุณารอสักครู่ ✨</p>
    </div>
  );
}