import React from 'react';
import { X, Edit } from 'lucide-react';
import { CATEGORY_STYLES } from '../constants';

export default function StoryModal({ story, onClose, onEdit }) {
  if (!story) return null;

  const categoryStyle = CATEGORY_STYLES[story.category] || CATEGORY_STYLES['Other'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-4 border-white/50 dark:border-gray-700">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white p-6 flex items-center justify-between rounded-t-3xl shadow-lg">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{story.title}</h2>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm font-semibold">
              {categoryStyle.emoji} {story.category || 'Other'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-full transition-all transform hover:scale-110 hover:rotate-90"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="p-8">
          {/* Content Grid */}
          <div className={`grid ${story.thaiContent ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6 mb-8`}>
            <div className="transform hover:scale-[1.02] transition-transform">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3 pb-2 border-b-4 border-blue-400 dark:border-blue-600">
                <span className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
                🇬🇧 English Version
              </h3>
              <div className="prose max-w-none bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-inner border-2 border-blue-200 dark:border-blue-800">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                  {story.content}
                </div>
              </div>
            </div>
            
            {story.thaiContent && (
              <div className="transform hover:scale-[1.02] transition-transform">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3 pb-2 border-b-4 border-green-400 dark:border-green-600">
                  <span className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
                  🇹🇭 ฉบับภาษาไทย
                </h3>
                <div className="prose max-w-none bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-inner border-2 border-green-200 dark:border-green-800">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                    {story.thaiContent}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vocabulary */}
          {story.vocab && (
            <div className="border-t-4 border-indigo-200 dark:border-indigo-800 pt-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                <span className="text-4xl animate-bounce">📚</span>
                คำศัพท์
              </h3>
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-inner border-2 border-indigo-200 dark:border-indigo-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {story.vocab.split('\n').filter(v => v.trim()).map((vocab, idx) => (
                    <div key={idx} className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl text-gray-700 dark:text-gray-300 font-medium border-2 border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all transform hover:scale-105 hover:shadow-md">
                      <span className="text-indigo-600 dark:text-indigo-400 mr-2">●</span>
                      {vocab}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Edit Button in Modal */}
          <div className="border-t-4 border-amber-200 dark:border-amber-800 pt-8">
            <button
              onClick={() => onEdit(story)}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-xl font-bold text-lg"
            >
              <Edit className="w-6 h-6 animate-pulse" />
              ✏️ แก้ไขเรื่องนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}