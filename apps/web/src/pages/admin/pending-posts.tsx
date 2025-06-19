import { trpc } from '../../utils/trpc';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const PendingPosts = () => {
  const { currentLang } = useLanguage();
  const navigate = useNavigate();
  const { data: posts = [], isLoading, refetch } = trpc.blogs.getAll.useQuery();
  const approveMutation = trpc.blogs.approve.useMutation({
    onSuccess: () => refetch()
  });
  const rejectMutation = trpc.blogs.reject.useMutation({
    onSuccess: () => refetch()
  });

  // Sadece bekleyenler (pending)
  const filteredPosts = posts.filter(post => post.status === 'pending');

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };
  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="pending-posts">
      <div className="page-container">
        <div className="header">
          <button
            className="back-button"
            onClick={() => navigate('/admin')}
          >
            <span style={{fontSize: '1.2em', marginRight: 4}}>←</span> {currentLang === 'tr' ? 'Admin Paneline Dön' : 'Back to Admin Panel'}
          </button>
          <h1 className="page-title">
            {currentLang === 'tr' ? 'Bekleyen Blog Yazıları' : 'Pending Blog Posts'}
          </h1>
        </div>
        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              {currentLang === 'tr' ? 'Bekleyen yazı yok.' : 'No pending posts.'}
            </div>
          ) : filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-image">
                {post.image ? (
                  <img src={post.image} alt={post.title} />
                ) : (
                  <div className="default-image">?</div>
                )}
              </div>
              <div className="post-content">
                <span className="category">{post.category}</span>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-summary">{post.summary}</p>
                <div className="post-meta">
                  <span className="author">{post.author}</span>
                  <span className="date">{post.date}</span>
                  <span className="status" data-status={post.status}>
                    {post.status === 'pending'
                      ? (currentLang === 'tr' ? 'Bekliyor' : 'Pending')
                      : post.status === 'published'
                        ? (currentLang === 'tr' ? 'Yayında' : 'Published')
                        : (currentLang === 'tr' ? 'Reddedildi' : 'Rejected')}
                  </span>
                </div>
              </div>
              <div className="post-actions">
                <button className="btn btn-primary" onClick={()=>handleApprove(post.id)}>
                  {currentLang === 'tr' ? 'Onayla' : 'Approve'}
                </button>
                <button className="btn btn-danger" onClick={()=>handleReject(post.id)}>
                  {currentLang === 'tr' ? 'Reddet' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .pending-posts {
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
        }
        .post-meta {
          display: flex;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .status {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .status[data-status="pending"] {
          background: #fef9c3;
          color: #a16207;
        }
        .status[data-status="rejected"] {
          background: #fee2e2;
          color: #991b1b;
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

export default PendingPosts; 