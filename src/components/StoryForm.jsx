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
    <div className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 animate-scale-in hover-lift ${
      isEditMode ? 'border-4 border-amber-400' : 'border-2 border-indigo-200'
    }`}>
      <h2 className={`text-2xl font-bold bg-clip-text text-transparent mb-4 flex items-center gap-2 ${
        isEditMode 
          ? 'bg-gradient-to-r from-amber-600 to-orange-600' 
          : 'bg-gradient-to-r from-indigo-600 to-purple-600'
      }`}>
        {isEditMode ? (
          <>
            <Edit className="w-6 h-6 text-amber-600 animate-pulse" />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ชื่อเรื่อง
          </label>
          <input
            type="text"
            value={story.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all ${
              isEditMode 
                ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="The Adventure Begins..."
          />
        </div>

        <div className="transform hover:scale-[1.01] transition-transform">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            หมวดหมู่
          </label>
          <select
            value={story.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all ${
              isEditMode 
                ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🇬🇧 เนื้อเรื่องภาษาอังกฤษ *
            </label>
            <textarea
              value={story.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all h-64 ${
                isEditMode 
                  ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="Once upon a time..."
            />
          </div>

          <div className="transform hover:scale-[1.01] transition-transform">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🇹🇭 เนื้อเรื่องภาษาไทย (ไม่บังคับ)
            </label>
            <textarea
              value={story.thaiContent || ''}
              onChange={(e) => handleChange('thaiContent', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all h-64 ${
                isEditMode 
                  ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="กาลครั้งหนึ่งนานมาแล้ว..."
            />
          </div>
        </div>

        <div className="transform hover:scale-[1.01] transition-transform">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📚 คำศัพท์ (แยกแต่ละคำด้วยการขึ้นบรรทัดใหม่)
          </label>
          <textarea
            value={story.vocab || ''}
            onChange={(e) => handleChange('vocab', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all h-32 ${
              isEditMode 
                ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="adventure - การผจญภัย&#10;courage - ความกล้าหาญ&#10;journey - การเดินทาง"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSubmit}
            className={`flex-1 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg font-medium ${
              isEditMode
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            {isEditMode ? '✅ บันทึกการแก้ไข' : '💾 บันทึก'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all transform hover:scale-105 font-medium"
          >
            ❌ ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}