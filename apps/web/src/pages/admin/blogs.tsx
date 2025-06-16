import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  category: string;
  image?: string;
}

const AdminBlogs = () => {
  const { user } = useUser();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Role kontrolü
    if (!user || (user.publicMetadata.role !== 'admin' && user.publicMetadata.role !== 'superadmin')) {
      navigate('/');
      return;
    }

    // Blog yazılarını getir
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      // API'den blog yazılarını getir
      const response = await fetch('/api/blogs/pending');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // API'ye durum değişikliği isteği gönder
      await fetch(`/api/blogs/${postId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Blog yazılarını güncelle
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  const handleEdit = (postId: string) => {
    navigate(`/admin/blogs/edit/${postId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-blogs">
      <div className="container">
        <h1 className="page-title">
          {currentLang === 'tr' ? 'Blog Yönetimi' : 'Blog Management'}
        </h1>

        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="no-posts">
              {currentLang === 'tr' 
                ? 'Onay bekleyen blog yazısı bulunmuyor.' 
                : 'No pending blog posts.'}
            </div>
          ) : (
            posts.map((post) => (
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
                  <div className="post-meta">
                    <span className="author">{post.author}</span>
                    <span className="date">{post.date}</span>
                  </div>
                  <div className="post-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleStatusChange(post.id, 'approved')}
                    >
                      {currentLang === 'tr' ? 'Yayınla' : 'Publish'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleStatusChange(post.id, 'rejected')}
                    >
                      {currentLang === 'tr' ? 'Reddet' : 'Reject'}
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleEdit(post.id)}
                    >
                      {currentLang === 'tr' ? 'Düzenle' : 'Edit'}
                    </button>
                  </div>
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

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2rem;
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
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .post-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          flex: 1;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-secondary:hover {
          background: #fecaca;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid #e5e7eb;
          color: #4b5563;
        }

        .btn-outline:hover {
          background: #f3f4f6;
        }

        .no-posts {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          color: #6b7280;
          font-size: 1.125rem;
          border: 1px solid #e5e7eb;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 1.125rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .admin-blogs {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .post-image {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminBlogs; 