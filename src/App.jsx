import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy as fbOrderBy, updateDoc } from 'firebase/firestore';
import { BookOpen } from 'lucide-react';

import Header from './components/Header';
import StoryForm from './components/StoryForm';
import StoryCard from './components/StoryCard';
import StoryModal from './components/StoryModal';
import Pagination from './components/Pagination';
import Loading from './components/Loading';
import { FIREBASE_CONFIG, ITEMS_PER_PAGE } from './constants';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const firestore = getFirestore(app);

export default function App() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter & Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form states
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    thaiContent: '',
    vocab: '',
    category: 'Other'
  });
  
  const [editingStory, setEditingStory] = useState(null);

  // Load stories on mount
  useEffect(() => {
    loadStories();
  }, []);

  // Apply filters when stories or filter criteria change
  useEffect(() => {
    applyFiltersAndSort();
  }, [stories, searchTerm, sortBy, selectedCategory]);

  // Update pagination when filtered stories change
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
    } catch (error) {
      console.error('Error loading stories:', error);
      alert('ไม่สามารถโหลดเรื่องได้');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...stories];

    // Filter by category
    if (selectedCategory !== 'ทั้งหมด') {
      result = result.filter(story => story.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (story.thaiContent && story.thaiContent.toLowerCase().includes(searchTerm.toLowerCase()))
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
      alert('กรุณากรอกชื่อเรื่องและเนื้อเรื่องภาษาอังกฤษ');
      return;
    }

    try {
      const storyData = {
        title: newStory.title.trim(),
        content: newStory.content.trim(),
        thaiContent: newStory.thaiContent.trim(),
        vocab: newStory.vocab.trim(),
        category: newStory.category,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(firestore, 'stories'), storyData);
      
      setStories([{ id: docRef.id, ...storyData }, ...stories]);
      setNewStory({ title: '', content: '', thaiContent: '', vocab: '', category: 'Other' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding story:', error);
      alert('ไม่สามารถบันทึกเรื่องได้');
    }
  };

  const updateStory = async () => {
    if (!editingStory.title.trim() || !editingStory.content.trim()) {
      alert('กรุณากรอกชื่อเรื่องและเนื้อเรื่องภาษาอังกฤษ');
      return;
    }

    try {
      const storyRef = doc(firestore, 'stories', editingStory.id);
      const updatedData = {
        title: editingStory.title.trim(),
        content: editingStory.content.trim(),
        thaiContent: editingStory.thaiContent.trim(),
        vocab: editingStory.vocab.trim(),
        category: editingStory.category,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(storyRef, updatedData);
      
      setStories(stories.map(s => 
        s.id === editingStory.id 
          ? { ...s, ...updatedData }
          : s
      ));
      
      setEditingStory(null);
      setShowEditForm(false);
      alert('แก้ไขเรื่องสำเร็จ!');
    } catch (error) {
      console.error('Error updating story:', error);
      alert('ไม่สามารถแก้ไขเรื่องได้');
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

  const startEditStory = (story) => {
    setEditingStory({
      id: story.id,
      title: story.title,
      content: story.content,
      thaiContent: story.thaiContent || '',
      vocab: story.vocab || '',
      category: story.category || 'Other'
    });
    setShowEditForm(true);
    setViewingStory(null);
  };

  const getCurrentPageStories = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStories.slice(startIndex, endIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 animate-gradient">
      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          filteredCount={filteredStories.length}
          onAddClick={() => setShowAddForm(!showAddForm)}
        />

        {/* Add Story Form */}
        {showAddForm && (
          <StoryForm
            story={newStory}
            onChange={setNewStory}
            onSubmit={addStory}
            onCancel={() => {
              setShowAddForm(false);
              setNewStory({ title: '', content: '', thaiContent: '', vocab: '', category: 'Other' });
            }}
            isEditMode={false}
          />
        )}

        {/* Edit Story Form */}
        {showEditForm && editingStory && (
          <StoryForm
            story={editingStory}
            onChange={setEditingStory}
            onSubmit={updateStory}
            onCancel={() => {
              setShowEditForm(false);
              setEditingStory(null);
            }}
            isEditMode={true}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {getCurrentPageStories().length === 0 ? (
                <div className="col-span-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center animate-scale-in">
                  <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4 animate-bounce" />
                  <p className="text-gray-500 text-lg font-medium whitespace-pre-line">
                    {searchTerm || selectedCategory !== 'ทั้งหมด'
                      ? '😔 ไม่พบเรื่องที่ตรงกับเงื่อนไข'
                      : '📚 ยังไม่มีเรื่องในคอลเลกชัน\nกดปุ่ม "เพิ่มเรื่อง" เพื่อเริ่มต้น'}
                  </p>
                </div>
              ) : (
                getCurrentPageStories().map((story, index) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    index={index}
                    onView={setViewingStory}
                    onEdit={startEditStory}
                    onDelete={deleteStory}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Story Viewer Modal */}
        <StoryModal
          story={viewingStory}
          onClose={() => setViewingStory(null)}
          onEdit={startEditStory}
        />
      </div>
    </div>
  );
}