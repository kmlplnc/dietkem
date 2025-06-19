import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { trpc } from '../../utils/trpc';

interface BlogFormData {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  content: string;
  image?: string;
  status: 'draft' | 'published' | 'pending' | 'approved' | 'rejected';
}

const BlogEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<BlogFormData>({
    id: isNew ? crypto.randomUUID() : id || '',
    title: '',
    summary: '',
    category: '',
    author: '',
    content: '',
    status: 'draft'
  });

  const { data: post, isLoading } = trpc.blogs.getById.useQuery(id || '', {
    enabled: !isNew && !!id
  });

  const updateMutation = trpc.blogs.update.useMutation({
    onSuccess: () => {
      navigate('/admin/blog-management');
    },
    onError: (error) => {
      console.error('Error updating post:', error);
    }
  });

  const createMutation = trpc.blogs.create.useMutation({
    onSuccess: () => {
      navigate('/admin/blog-management');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    }
  });

  useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        await createMutation.mutateAsync({
          title: formData.title,
          summary: formData.summary,
          category: formData.category,
          author: formData.author,
          content: formData.content,
          image: formData.image,
          date: new Date().toISOString().split('T')[0],
        });
      } else {
        await updateMutation.mutateAsync({
          ...formData,
          status: formData.status === 'draft' ? 'pending' : formData.status,
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading && !isNew) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blog-edit">
      <div className="container">
        <div className="header">
          <h1 className="page-title">
            {isNew 
              ? (currentLang === 'tr' ? 'Yeni Blog Yazısı' : 'New Blog Post')
              : (currentLang === 'tr' ? 'Blog Yazısını Düzenle' : 'Edit Blog Post')}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="title">
              {currentLang === 'tr' ? 'Başlık' : 'Title'}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">
              {currentLang === 'tr' ? 'Özet' : 'Summary'}
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              {currentLang === 'tr' ? 'Kategori' : 'Category'}
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">
              {currentLang === 'tr' ? 'Yazar' : 'Author'}
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">
              {currentLang === 'tr' ? 'Görsel URL' : 'Image URL'}
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">
              {currentLang === 'tr' ? 'İçerik' : 'Content'}
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">
              {currentLang === 'tr' ? 'Durum' : 'Status'}
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="draft">
                {currentLang === 'tr' ? 'Taslak' : 'Draft'}
              </option>
              <option value="published">
                {currentLang === 'tr' ? 'Yayında' : 'Published'}
              </option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/admin/blog-management')}
            >
              {currentLang === 'tr' ? 'İptal' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary">
              {currentLang === 'tr' ? 'Kaydet' : 'Save'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .blog-edit {
          padding: 2rem;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        .edit-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          color: #1f2937;
          background: white;
        }
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        .form-group select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-primary {
          background: #2563eb;
          color: white;
          border: none;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }
        .btn-outline {
          background: transparent;
          border: 1px solid #e5e7eb;
          color: #4b5563;
        }
        .btn-outline:hover {
          background: #f3f4f6;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          font-size: 1.125rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default BlogEdit; 