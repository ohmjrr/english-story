import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Eye, X, AlertCircle, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy as fbOrderBy, limit, startAfter, endBefore, limitToLast } from 'firebase/firestore';

// Firebase Configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB2cqf0cXGsHsFUSmE1wDXoG78vFV1CxhI",
  authDomain: "vocab-5c83f.firebaseapp.com",
  projectId: "vocab-5c83f",
  storageBucket: "vocab-5c83f.firebasestorage.app",
  messagingSenderId: "324294179304",
  appId: "1:324294179304:web:1da7b6d6a314991c668c5d",
  measurementId: "G-0XYS023X8L"
};

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const firestore = getFirestore(app);

const ITEMS_PER_PAGE = 6;

export default function EnglishStoryApp() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);
  
  // Filter & Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    vocab: ''
  });

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [stories, searchTerm, sortBy]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredStories.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [filteredStories]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const storiesCollection = collection(firestore, 'stories');
      const q = query(storiesCollection, fbOrderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const loadedStories = [];
      querySnapshot.forEach((doc) => {
        loadedStories.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setStories(loadedStories);
      setLoading(false);
    } catch (error) {
      console.error('Error loading stories:', error);
      setFirebaseError('ไม่สามารถโหลดเรื่องได้');
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...stories];

    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setFilteredStories(result);
  };

  const addStory = async () => {
    if (!newStory.title.trim() || !newStory.content.trim()) {
      alert('กรุณากรอกชื่อเรื่องและเนื้อหา');
      return;
    }

    try {
      const storyData = {
        title: newStory.title.trim(),
        content: newStory.content.trim(),
        vocab: newStory.vocab.trim(),
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(firestore, 'stories'), storyData);
      
      setStories([{ id: docRef.id, ...storyData }, ...stories]);
      setNewStory({ title: '', content: '', vocab: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding story:', error);
      alert('ไม่สามารถบันทึกเรื่องได้');
    }
  };

  const deleteStory = async (storyId) => {
    if (!confirm('ต้องการลบเรื่องนี้ใช่หรือไม่?')) return;

    try {
      await deleteDoc(doc(firestore, 'stories', storyId));
      
      setStories(stories.filter(s => s.id !== storyId));
      if (viewingStory && viewingStory.id === storyId) {
        setViewingStory(null);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('ไม่สามารถลบเรื่องได้');
    }
  };

  const getCurrentPageStories = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStories.slice(startIndex, endIndex);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (firebaseError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 text-center mb-4">{firebaseError}</p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">วิธีแก้ไข:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>สร้าง Firebase project ที่ console.firebase.google.com</li>
              <li>เปิดใช้งาน Firestore Database</li>
              <li>คัดลอก config มาใส่ในโค้ด</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">English Story Collection</h1>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              เพิ่มเรื่อง
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาเรื่อง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <SlidersHorizontal className="w-5 h-5" />
              ตัวกรอง
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เรียงตาม:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-2 rounded-lg transition ${
                    sortBy === 'newest'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ล่าสุด
                </button>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`px-4 py-2 rounded-lg transition ${
                    sortBy === 'oldest'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  เก่าสุด
                </button>
                <button
                  onClick={() => setSortBy('title')}
                  className={`px-4 py-2 rounded-lg transition ${
                    sortBy === 'title'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ชื่อเรื่อง (A-Z)
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            พบ {filteredStories.length} เรื่อง
            {searchTerm && ` จากคำค้นหา "${searchTerm}"`}
          </div>
        </div>

        {/* Add Story Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">เพิ่มเรื่องใหม่</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อเรื่อง
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="The Adventure Begins..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เนื้อเรื่อง
                </label>
                <textarea
                  value={newStory.content}
                  onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-48"
                  placeholder="Once upon a time..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำศัพท์ (แยกแต่ละคำด้วยการขึ้นบรรทัดใหม่)
                </label>
                <textarea
                  value={newStory.vocab}
                  onChange={(e) => setNewStory({ ...newStory, vocab: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                  placeholder="adventure - การผจญภัย&#10;courage - ความกล้าหาญ&#10;journey - การเดินทาง"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addStory}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewStory({ title: '', content: '', vocab: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">กำลังโหลดเรื่อง...</p>
          </div>
        ) : (
          <>
            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {getCurrentPageStories().length === 0 ? (
                <div className="col-span-full bg-white rounded-lg shadow-lg p-8 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm
                      ? `ไม่พบเรื่องที่ตรงกับ "${searchTerm}"`
                      : 'ยังไม่มีเรื่องในคอลเลกชัน กดปุ่ม "เพิ่มเรื่อง" เพื่อเริ่มต้น'}
                  </p>
                </div>
              ) : (
                getCurrentPageStories().map((story) => (
                  <div key={story.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{story.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {new Date(story.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-700 line-clamp-3 flex-1 mb-4">{story.content}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingStory(story)}
                        className="flex-1 flex items-center justify-center gap-2 p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                      >
                        <Eye className="w-5 h-5" />
                        อ่านเรื่อง
                      </button>
                      <button
                        onClick={() => deleteStory(story.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="ลบเรื่อง"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    ก่อนหน้า
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg transition ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    ถัดไป
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-3">
                  หน้า {currentPage} จาก {totalPages}
                </p>
              </div>
            )}
          </>
        )}

        {/* Story Viewer Modal */}
        {viewingStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">{viewingStory.title}</h2>
                <button
                  onClick={() => setViewingStory(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="prose max-w-none mb-8">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {viewingStory.content}
                  </div>
                </div>
                {viewingStory.vocab && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📚 คำศัพท์</h3>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {viewingStory.vocab.split('\n').filter(v => v.trim()).map((vocab, idx) => (
                          <div key={idx} className="text-gray-700 py-1">
                            • {vocab}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}