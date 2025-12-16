import { useState, useEffect } from 'react';
import { fetchMovies, updateMovie } from '../api/movies';
import { fetchCategories, createCategory, updateCategory as updateCategoryApi, deleteCategory } from '../api/categories';
import type { Category } from '../api/categories';
import type { Movie } from '../types';

export const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [moviesData, categoriesData] = await Promise.all([
        fetchMovies(),
        fetchCategories()
      ]);
      setMovies(moviesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (movieId: string, category: string) => {
    setSaving(movieId);
    try {
      const updated = await updateMovie(movieId, { category });
      setMovies(prev => prev.map(m => m._id === movieId ? { ...m, category: updated.category } : m));
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleFreePreviewToggle = async (movieId: string, isFreePreview: boolean) => {
    setSaving(movieId);
    try {
      const updated = await updateMovie(movieId, { isFreePreview });
      setMovies(prev => prev.map(m => m._id === movieId ? { ...m, isFreePreview: updated.isFreePreview } : m));
    } catch (error) {
      console.error('Failed to update free preview:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleTagsChange = async (movieId: string, tagsString: string) => {
    const tags = tagsString.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
    setSaving(movieId);
    try {
      const updated = await updateMovie(movieId, { tags });
      setMovies(prev => prev.map(m => m._id === movieId ? { ...m, tags: updated.tags } : m));
    } catch (error) {
      console.error('Failed to update tags:', error);
    } finally {
      setSaving(null);
    }
  };

  const filteredMovies = movies.filter(m => {
    const matchesCategory = filter === 'all' || (m.category || 'uncategorized') === filter;
    const matchesTag = !tagFilter || (m.tags || []).includes(tagFilter);
    return matchesCategory && matchesTag;
  });

  // Get all unique tags from all movies
  const allTags = [...new Set(movies.flatMap(m => m.tags || []))].sort();

  const getCategoryCounts = () => {
    const counts: Record<string, number> = { all: movies.length, uncategorized: 0 };
    counts.uncategorized = movies.filter(m => !m.category || m.category === 'uncategorized').length;
    categories.forEach(cat => {
      counts[cat.slug] = movies.filter(m => m.category === cat.slug).length;
    });
    return counts;
  };

  const handleAddCategory = async () => {
    if (!newCategoryLabel.trim()) return;
    try {
      const slug = newCategoryLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newCat = await createCategory({ slug, label: newCategoryLabel.trim(), order: categories.length });
      setCategories(prev => [...prev, newCat]);
      setNewCategoryLabel('');
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm(`Supprimer la catégorie "${slug}"?`)) return;
    try {
      await deleteCategory(slug);
      setCategories(prev => prev.filter(c => c.slug !== slug));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleUpdateCategoryLabel = async (slug: string, newLabel: string) => {
    try {
      const updated = await updateCategoryApi(slug, { label: newLabel });
      setCategories(prev => prev.map(c => c.slug === slug ? updated : c));
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const counts = getCategoryCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1214] flex items-center justify-center">
        <div className="text-[#ffd700] text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1214] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#ffd700]">🎬 Admin - Gestion des vidéos</h1>
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="px-4 py-2 bg-[#1a2428] hover:bg-[#2a3438] rounded-lg text-sm"
          >
            ⚙️ Gérer les catégories
          </button>
        </div>

        {/* Category Manager Modal */}
        {showCategoryManager && (
          <div className="mb-6 p-4 bg-[#1a2428] rounded-lg">
            <h3 className="text-lg font-bold text-[#ffd700] mb-4">Gestion des catégories</h3>
            
            {/* Add new category */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                placeholder="Nouvelle catégorie..."
                className="flex-1 bg-[#0a1214] border border-gray-600 rounded px-3 py-2 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[#ffd700] text-[#0a1214] font-bold rounded hover:bg-yellow-400"
              >
                + Ajouter
              </button>
            </div>

            {/* List categories */}
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.slug} className="flex items-center gap-2 p-2 bg-[#0a1214] rounded">
                  <input
                    type="text"
                    defaultValue={cat.label}
                    onBlur={(e) => e.target.value !== cat.label && handleUpdateCategoryLabel(cat.slug, e.target.value)}
                    className="flex-1 bg-transparent border-b border-transparent hover:border-gray-600 focus:border-[#ffd700] px-2 py-1"
                  />
                  <span className="text-xs text-gray-500">({cat.slug})</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.slug)}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-[#ffd700] text-[#0a1214] font-bold' 
                : 'bg-[#1a2428] text-white hover:bg-[#2a3438]'
            }`}
          >
            Tous ({counts.all})
          </button>
          <button
            onClick={() => setFilter('uncategorized')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'uncategorized' 
                ? 'bg-[#ffd700] text-[#0a1214] font-bold' 
                : 'bg-[#1a2428] text-white hover:bg-[#2a3438]'
            }`}
          >
            Non classé ({counts.uncategorized || 0})
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setFilter(cat.slug)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === cat.slug 
                  ? 'bg-[#ffd700] text-[#0a1214] font-bold' 
                  : 'bg-[#1a2428] text-white hover:bg-[#2a3438]'
              }`}
            >
              {cat.label} ({counts[cat.slug] || 0})
            </button>
          ))}
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <span className="text-xs text-gray-400 mr-2">Tags:</span>
            <div className="inline-flex flex-wrap gap-2">
              <button
                onClick={() => setTagFilter(null)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  tagFilter === null
                    ? 'bg-[#ffd700] text-[#0a1214] font-bold'
                    : 'bg-[#1a2428] text-gray-300 hover:bg-[#2a3438]'
                }`}
              >
                Tous
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    tagFilter === tag
                      ? 'bg-[#ffd700] text-[#0a1214] font-bold'
                      : 'bg-[#1a2428] text-gray-300 hover:bg-[#2a3438]'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Movies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMovies.map(movie => (
            <div 
              key={movie._id} 
              className={`bg-[#1a2428] rounded-lg overflow-hidden border-2 transition-all ${
                saving === movie._id ? 'border-[#ffd700] opacity-70' : 'border-transparent'
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-[#0a1214] relative">
                {movie.thumbnailUrl ? (
                  <img 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No thumbnail
                  </div>
                )}
                {movie.isFreePreview && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    FREE
                  </span>
                )}
              </div>
              
              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3 truncate" title={movie.title}>
                  {movie.title}
                </h3>
                
                {/* Category selector */}
                <div className="mb-3 relative z-10">
                  <label className="text-xs text-gray-400 block mb-1">Catégorie</label>
                  <select
                    key={`${movie._id}-${categories.length}`}
                    value={movie.category || 'uncategorized'}
                    onChange={(e) => handleCategoryChange(movie._id, e.target.value)}
                    disabled={saving === movie._id}
                    className="w-full bg-[#0a1214] border border-gray-600 rounded px-3 py-2 text-sm focus:border-[#ffd700] focus:outline-none cursor-pointer appearance-none"
                    style={{ WebkitAppearance: 'menulist', MozAppearance: 'menulist' }}
                  >
                    <option value="uncategorized">Non classé</option>
                    {categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Free preview toggle */}
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={movie.isFreePreview || false}
                    onChange={(e) => handleFreePreviewToggle(movie._id, e.target.checked)}
                    disabled={saving === movie._id}
                    className="w-4 h-4 accent-[#ffd700]"
                  />
                  <span className="text-sm text-gray-300">Preview gratuit</span>
                </label>

                {/* Tags input */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tags (séparés par virgule)</label>
                  <input
                    type="text"
                    defaultValue={(movie.tags || []).join(', ')}
                    onBlur={(e) => handleTagsChange(movie._id, e.target.value)}
                    disabled={saving === movie._id}
                    placeholder="featured, new, 4k..."
                    className="w-full bg-[#0a1214] border border-gray-600 rounded px-3 py-2 text-sm focus:border-[#ffd700] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Aucune vidéo dans cette catégorie
          </div>
        )}
      </div>
    </div>
  );
};
