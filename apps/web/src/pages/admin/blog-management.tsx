import { useState } from 'react';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../../utils/trpc';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  image?: string;
  status: 'draft' | 'published' | 'approved' | 'rejected';
  content: string;
}

const BlogManagement = () => {
  // CLERK_DISABLED_TEMP: const { user } = useUser();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();

  // tRPC query'sini kullan
  const { data: posts = [], isLoading, refetch } = trpc.blogs.getAll.useQuery();

  // Delete mutation
  const deleteMutation = trpc.blogs.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    }
  });

  const handleDelete = async (postId: string) => {
    if (window.confirm(currentLang === 'tr' ? 'Bu blog yazısını silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this blog post?')) {
      try {
        await deleteMutation.mutateAsync(postId);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEdit = (postId: string) => {
    navigate(`/admin/blogs/edit/${postId}`);
  };

  // Sadece published ve rejected olanlar
  const filteredPosts = posts.filter(post => post.status === 'published' || post.status === 'rejected');

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-blogs">
      <div className="page-container">
        <div className="header">
          <button
            className="back-button"
            onClick={() => navigate('/admin')}
          >
            <span style={{fontSize: '1.2em', marginRight: 4}}>←</span> {currentLang === 'tr' ? 'Admin Paneline Dön' : 'Back to Admin Panel'}
          </button>
          <h1 className="page-title">
            {currentLang === 'tr' ? 'Blog Yönetimi' : 'Blog Management'}
          </h1>
        </div>
        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              {currentLang === 'tr' 
                ? 'Blog yazısı bulunmuyor.' 
                : 'No blog posts.'}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-image">
                  {post.image ? (
                    <img src={post.image} alt={post.title} />
                  ) : (
                    <div className="default-image">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="post-content">
                  <span className="category">{post.category}</span>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-summary">{post.summary}</p>
                  <div className="post-meta">
                    <span className="author">{post.author}</span>
                    <span className="date">{post.date}</span>
                  </div>
                  <div className={`status-label ${post.status}`}
                    data-status={post.status}>
                    {post.status === 'published'
                      ? (currentLang === 'tr' ? 'Yayında' : 'Published')
                      : (currentLang === 'tr' ? 'Reddedildi' : 'Rejected')}
                  </div>
                </div>
                <div className="post-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => handleEdit(post.id)}
                  >
                    {currentLang === 'tr' ? 'Düzenle' : 'Edit'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    {currentLang === 'tr' ? 'Sil' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        .admin-blogs {
          padding: 2rem;
        }
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 64px;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          position: relative;
        }
        .back-button {
          position: absolute;
          left: 0;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .back-button:hover {
          background: #e5e7eb;
          transform: translateX(-2px);
        }
        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          text-align: center;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .post-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15);
        }
        .post-image {
          width: 100%;
          height: 200px;
          background: #f3f4f6;
          position: relative;
        }
        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .default-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }
        .default-image svg {
          width: 48px;
          height: 48px;
        }
        .post-content {
          padding: 1.5rem;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-height: 180px;
        }
        .category {
          display: inline-block;
          background: #f3f4f6;
          color: #1f2937;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
          border: 1px solid #e5e7eb;
        }
        .post-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          text-align: left;
          width: 100%;
        }
        .post-summary {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-align: left;
          width: 100%;
        }
        .post-meta {
          display: flex;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          width: 100%;
        }
        .status-label {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 80px;
          width: fit-content;
          margin: 0 0 1rem 0;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 9999px;
          padding: 0.25rem 0.75rem;
          letter-spacing: 0.02em;
        }
        .status-label.approved {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .status-label.published {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
        }
        .status-label.rejected {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        }
        .post-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          padding: 1rem 1.5rem;
          border-top: 1px solid #f3f4f6;
          background: #fafbfc;
        }
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
        }
        .btn-primary {
          background: #2563eb;
          color: white;
          border: none;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }
        .btn-danger {
          background: #ef4444;
          color: white;
          border: none;
        }
        .btn-danger:hover {
          background: #dc2626;
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
        .no-posts {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  );
};

export default BlogManagement; 