"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Video } from 'lucide-react';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import Link from 'next/link';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', isActive: true });
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/videos/admin');
      setVideos(res.data.data);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.delete(`/api/videos/${id}`);
      toast.success('Video deleted');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const handleToggleActive = async (video) => {
    try {
      await api.put(`/api/videos/${video._id}`, { isActive: !video.isActive });
      toast.success('Video status updated');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedVideos.length === 0) return toast.error('Please upload a video first');
    if (!formData.title) return toast.error('Title is required');

    setIsSubmitting(true);
    try {
      await api.post('/api/videos', {
        title: formData.title,
        videoUrl: uploadedVideos[0].url,
        isActive: formData.isActive
      });
      toast.success('Video added successfully');
      setShowAddForm(false);
      setFormData({ title: '', isActive: true });
      setUploadedVideos([]);
      fetchVideos();
    } catch (error) {
      toast.error('Failed to add video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Featured Videos</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn-primary flex items-center gap-2"
        >
          {showAddForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Video</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-surface border border-border p-8 mb-8">
          <h2 className="text-xl font-serif mb-6 border-b border-border pb-2">Add New Video</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Video Title</label>
              <input 
                type="text" 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                className="input-field" 
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Upload Video (MP4)</label>
              <CloudinaryUploader 
                items={uploadedVideos} 
                setItems={setUploadedVideos} 
                maxItems={1} 
                resourceType="video" 
              />
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="isActive" className="text-sm text-textPrimary">Active on Landing Page</label>
            </div>

            <div className="flex justify-end">
              <button disabled={isSubmitting} type="submit" className="btn-primary">
                {isSubmitting ? 'Saving...' : 'Save Video'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-textMuted">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-textMuted col-span-3">No videos found. Upload your first featured video!</p>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="bg-surface border border-border overflow-hidden group">
              <div className="relative aspect-video bg-black">
                <video 
                  src={video.videoUrl} 
                  className="w-full h-full object-cover opacity-80"
                  muted
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => e.target.pause()}
                  loop
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleToggleActive(video)}
                    className={`px-2 py-1 text-[10px] uppercase tracking-wider ${video.isActive ? 'bg-success/10 text-success border-success/20' : 'bg-surface text-textMuted border-border'} border`}
                  >
                    {video.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button 
                    onClick={() => handleDelete(video._id)}
                    className="bg-error/10 text-error p-1 border border-error/20 hover:bg-error hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-textPrimary truncate">{video.title}</h3>
                <p className="text-xs text-textMuted mt-1">Uploaded {new Date(video.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
