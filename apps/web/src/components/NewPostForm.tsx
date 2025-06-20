import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface NewPostFormProps {
  onSubmit: (post: {
    title: string;
    category: string;
    summary: string;
    content: string;
    image?: string;
  }) => void;
}

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dup6ahhjt/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'dietkem';

const NewPostForm = ({ onSubmit }: NewPostFormProps) => {
  const { currentLang } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        category,
        summary,
        content,
        image: imageUrl || undefined
      });

      // Reset form
      setTitle('');
      setCategory('');
      setSummary('');
      setContent('');
      setImageFile(null);
      setImageUrl('');
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setIsUploading(true);
      setUploadError(null);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) {
          throw new Error(`Upload failed: ${res.status}`);
        }
        
        const text = await res.text();
        if (!text) {
          throw new Error('Empty response from upload service');
        }
        
        const data = JSON.parse(text);
        if (data.secure_url) {
          setImageUrl(data.secure_url);
        } else {
          setUploadError('Görsel yüklenemedi.');
        }
      } catch (err) {
        console.error('Image upload error:', err);
        setUploadError('Görsel yüklenemedi.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-post-form">
      <div className="form-group">
        <label htmlFor="title">
          {currentLang === 'tr' ? 'Başlık' : 'Title'}
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">
          {currentLang === 'tr' ? 'Kategori' : 'Category'}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="form-select"
        >
          <option value="">{currentLang === 'tr' ? 'Seçiniz' : 'Select'}</option>
          <option value="AI">AI</option>
          <option value="Bilimsel">Bilimsel</option>
          <option value="Uygulama">Uygulama</option>
          <option value="Danışan">Danışan</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="summary">
          {currentLang === 'tr' ? 'Özet' : 'Summary'}
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">
          {currentLang === 'tr' ? 'İçerik' : 'Content'}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="image" className="image-label">
          {currentLang === 'tr' ? 'Görsel (İsteğe Bağlı)' : 'Image (Optional)'}
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="form-file"
        />
        {isUploading && (
          <div style={{ color: '#2563eb', marginTop: 8 }}>
            {currentLang === 'tr' ? 'Yükleniyor...' : 'Uploading...'}
          </div>
        )}
        {uploadError && (
          <div style={{ color: 'red', marginTop: 8 }}>{uploadError}</div>
        )}
        {imageUrl && (
          <div style={{ marginTop: 8 }}>
            <img src={imageUrl} alt="Preview" style={{ maxWidth: 200, borderRadius: 8 }} />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="submit-button"
      >
        {isSubmitting
          ? (currentLang === 'tr' ? 'Gönderiliyor...' : 'Submitting...')
          : (currentLang === 'tr' ? 'Gönder' : 'Submit')}
      </button>

      <style>{`
        .new-post-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          color: #111827;
          background-color: white;
          transition: all 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .image-label {
          display: inline-block;
          padding: 0.75rem 1rem;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .image-label:hover {
          background-color: #e5e7eb;
        }

        .form-file {
          display: none;
        }

        .submit-button {
          width: 100%;
          padding: 0.875rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-button:hover {
          background-color: #1d4ed8;
        }

        .submit-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .new-post-form {
            padding: 1.5rem;
          }

          .form-input,
          .form-select,
          .form-textarea {
            font-size: 0.875rem;
            padding: 0.625rem;
          }
        }
      `}</style>
    </form>
  );
};

export default NewPostForm; 