"use client";
import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Play } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CloudinaryUploader({ items, setItems, maxItems = 6, resourceType = 'image' }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    
    if (items.length + files.length > maxItems) {
      toast.error(`You can only upload up to ${maxItems} files`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        return { url: data.secure_url, publicId: data.public_id };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setItems(prev => [...prev, ...uploadedFiles]);
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, [items, maxItems, setItems, resourceType]);

  const removeItem = (indexToRemove) => {
    setItems(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="relative border-2 border-dashed border-border p-8 flex flex-col items-center justify-center bg-surface transition-colors hover:border-primary cursor-pointer group">
        <input 
          type="file" 
          multiple 
          accept={`${resourceType}/*`}
          onChange={handleUpload}
          disabled={isUploading || items.length >= maxItems}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-textMuted group-hover:text-primary transition-colors">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm uppercase tracking-wider">Drag & drop or click to upload {resourceType}</span>
            <span className="text-xs mt-1">({items.length}/{maxItems} uploaded)</span>
          </div>
        )}
      </div>

      {/* Previews */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <div key={item.publicId || index} className="relative aspect-square border border-border group overflow-hidden bg-black">
              {resourceType === 'image' ? (
                <img 
                  src={item.url} 
                  alt={`Preview ${index}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <video src={item.url} className="w-full h-full object-cover opacity-80" muted />
              )}
              
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 bg-background/80 p-1 hover:bg-error hover:text-background transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              {resourceType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Play className="w-8 h-8 text-white opacity-50" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
