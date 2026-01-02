import React from 'react';
import { Sparkles, Edit } from 'lucide-react';
import { CATEGORIES, CATEGORY_STYLES } from '../constants';

export default function StoryForm({
  story,
  onChange,
  onSubmit,
  onCancel,
  isEditMode = false
}) {
  const handleChange = (field, value) => {
    onChange({ ...story, [field]: value });
  };

  return (
    <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 animate-scale-in hover-lift ${
      isEditMode ? 'border-4 border-amber-400 dark:border-amber-600' : 'border-2 border-indigo-200 dark:border-indigo-700'
    }`}>
      <h2 className={`text-2xl font-bold bg-clip-text text-transparent mb-4 flex items-center gap-2 ${
        isEditMode 
          ? 'bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400' 
          : 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400'
      }`}>
        {isEditMode ? (
          <>
            <Edit className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-pulse" />
            แก้ไขเรื่อง
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 text-yellow-400" />
            เพิ่มเรื่องใหม่
          </>
        )}
      </h2>
      
      <div className="space-y-4">
        <div className="transform hover:scale-[1.01] transition-transform">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ชื่อเรื่อง
          </label>
          <input
            type="text"
            value={story.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all dark:bg-gray-800 dark:text-white ${
              isEditMode 
                ? 'border-amber-300 dark:border-amber-600 focus:ring-amber-500 focus:border-amber-500'
                : 'border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="The Adventure Begins..."
          />
        </div>

        <div className="transform hover:scale-[1.01] transition-transform">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            หมวดหมู่
          </label>
          <select
            value={story.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all dark:bg-gray-800 dark:text-white ${
              isEditMode 
                ? 'border-amber-300 dark:border-amber-600 focus:ring-amber-500 focus:border-amber-500'
                : 'border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          >
            {CATEGORIES.filter(cat => cat !== 'ทั้งหมด').map((cat) => {
              const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES['Other'];
              return (
                <option key={cat} value={cat}>{style.emoji} {cat}</option>
              );
            })}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="transform hover:scale-[1.01] transition-transform">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🇬🇧 เนื้อเรื่องภาษาอังกฤษ *
            </label>
            <textarea
              value={story.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all h-64 dark:bg-gray-800 dark:text-white ${
                isEditMode 
                  ? 'border-amber-300 dark:border-amber-600 focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="Once upon a time..."
            />
          </div>

          <div className="transform hover:scale-[1.01] transition-transform">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🇹🇭 เนื้อเรื่องภาษาไทย (ไม่บังคับ)
            </label>
            <textarea
              value={story.thaiContent || ''}
              onChange={(e) => handleChange('thaiContent', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all h-64 dark:bg-gray-800 dark:text-white ${
                isEditMode 
                  ? 'border-amber-300 dark:border-amber-600 focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="กาลครั้งหนึ่งนานมาแล้ว..."
            />
          </div>
        </div>

        <div className="transform hover:scale-[1.01] transition-transform">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📚 คำศัพท์ (แยกแต่ละคำด้วยการขึ้นบรรทัดใหม่)
          </label>
          <textarea
            value={story.vocab || ''}
            onChange={(e) => handleChange('vocab', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all h-32 dark:bg-gray-800 dark:text-white ${
              isEditMode 
                ? 'border-amber-300 dark:border-amber-600 focus:ring-amber-500 focus:border-amber-500'
                : 'border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="adventure - การผจญภัย&#10;courage - ความกล้าหาญ&#10;journey - การเดินทาง"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSubmit}
            className={`flex-1 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg font-medium ${
              isEditMode
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 hover:from-amber-700 hover:to-orange-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            {isEditMode ? '✅ บันทึกการแก้ไข' : '💾 บันทึก'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-105 font-medium"
          >
            ❌ ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}