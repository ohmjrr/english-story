import React from 'react';
import { BookOpen, Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CATEGORIES, CATEGORY_STYLES } from '../constants';

export default function Header({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  filteredCount,
  onAddClick
}) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 hover-lift animate-slide-in-up border-2 border-white/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <BookOpen className="w-10 h-10 text-indigo-600 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              English Story Collection
            </h1>
            <p className="text-sm text-gray-500 mt-1">Explore the world of stories ✨</p>
          </div>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          เพิ่มเรื่อง
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="ค้นหาเรื่อง..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300"
          />
        </div>
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-6 py-3 border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 bg-white"
        >
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          <span className="font-medium text-indigo-600">ตัวกรอง</span>
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl space-y-4 animate-scale-in border-2 border-indigo-100">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              เรียงตาม:
            </label>
            <div className="flex flex-wrap gap-2">
              {['newest', 'oldest', 'title'].map((sort) => (
                <button
                  key={sort}
                  onClick={() => onSortChange(sort)}
                  className={`px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium ${
                    sortBy === sort
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 border-2 border-gray-200'
                  }`}
                >
                  {sort === 'newest' ? '⏰ ล่าสุด' : sort === 'oldest' ? '📅 เก่าสุด' : '🔤 ชื่อเรื่อง'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              หมวดหมู่:
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES['Other'];
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium border-2 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                        : `${style.color} border-current hover:shadow-md`
                    }`}
                  >
                    {cat !== 'ทั้งหมด' && style.emoji} {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm font-medium text-indigo-900 bg-indigo-50 px-4 py-2 rounded-lg inline-block">
        🔍 พบ <span className="font-bold text-lg">{filteredCount}</span> เรื่อง
        {searchTerm && ` จากคำค้นหา "${searchTerm}"`}
        {selectedCategory !== 'ทั้งหมด' && ` ในหมวด "${selectedCategory}"`}
      </div>
    </div>
  );
}