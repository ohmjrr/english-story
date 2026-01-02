import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { CATEGORY_STYLES } from '../constants';

export default function StoryCard({ story, index, onView, onEdit, onDelete }) {
  const categoryStyle = CATEGORY_STYLES[story.category] || CATEGORY_STYLES['Other'];

  return (
    <div
      className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover-lift flex flex-col border-2 border-white/50 animate-slide-in-up group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">
          {story.title}
        </h3>
        <span className={`ml-2 px-3 py-1 ${categoryStyle.color} text-xs font-semibold rounded-full border-2 whitespace-nowrap transform group-hover:scale-110 transition-transform`}>
          {categoryStyle.emoji} {story.category}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
        {new Date(story.createdAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      <p className="text-gray-700 line-clamp-3 flex-1 mb-4 leading-relaxed">{story.content}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onView(story)}
          className="flex-1 flex items-center justify-center gap-2 p-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all transform hover:scale-105 shadow-md font-medium"
        >
          <Eye className="w-5 h-5" />
          อ่าน
        </button>
        <button
          onClick={() => onEdit(story)}
          className="p-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-all transform hover:scale-110 hover:rotate-12 border-2 border-amber-200"
          title="แก้ไขเรื่อง"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(story.id)}
          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all transform hover:scale-110 hover:rotate-12 border-2 border-red-200"
          title="ลบเรื่อง"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}