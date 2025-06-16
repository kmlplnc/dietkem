import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface PendingPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  createdAt: Date;
}

const PendingPosts = () => {
  const { currentLang } = useLanguage();
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<PendingPost | null>(null);

  const handleApprove = async (postId: string) => {
    try {
      // API call to approve post
      // await approvePost(postId);
      setPendingPosts(posts => posts.filter(post => post.id !== postId));
      setSelectedPost(null);
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleReject = async (postId: string) => {
    try {
      // API call to reject post
      // await rejectPost(postId);
      setPendingPosts(posts => posts.filter(post => post.id !== postId));
      setSelectedPost(null);
    } catch (error) {
      console.error('Error rejecting post:', error);
    }
  };

  return (
    <div className="pending-posts">
      <h1 className="page-title">
        {currentLang === 'tr' ? 'Bekleyen Yazılar' : 'Pending Posts'}
      </h1>

      <div className="posts-grid">
        {pendingPosts.length === 0 ? (
          <p className="no-posts">
            {currentLang === 'tr' ? 'Bekleyen yazı bulunmuyor.' : 'No pending posts.'}
          </p>
        ) : (
          pendingPosts.map(post => (
            <div
              key={post.id}
              className={`post-card ${selectedPost?.id === post.id ? 'selected' : ''}`}
              onClick={() => setSelectedPost(post)}
            >
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <span className="post-category">{post.category}</span>
              </div>
              <p className="post-summary">{post.summary}</p>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && (
        <div className="post-actions">
          <button
            className="action-button approve"
            onClick={() => handleApprove(selectedPost.id)}
          >
            {currentLang === 'tr' ? 'Yayınla' : 'Publish'}
          </button>
          <button
            className="action-button reject"
            onClick={() => handleReject(selectedPost.id)}
          >
            {currentLang === 'tr' ? 'Reddet' : 'Reject'}
          </button>
        </div>
      )}

      <style>{`
        .pending-posts {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2rem;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .post-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.1);
        }

        .post-card.selected {
          border: 2px solid #2563eb;
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .post-category {
          font-size: 0.875rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }

        .post-summary {
          font-size: 0.875rem;
          color: #4b5563;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .post-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .action-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button.approve {
          background-color: #2563eb;
          color: white;
        }

        .action-button.approve:hover {
          background-color: #1d4ed8;
        }

        .action-button.reject {
          background-color: #ef4444;
          color: white;
        }

        .action-button.reject:hover {
          background-color: #dc2626;
        }

        .no-posts {
          text-align: center;
          color: #6b7280;
          font-size: 1.125rem;
          grid-column: 1 / -1;
          padding: 3rem;
          background: #f9fafb;
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .pending-posts {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .post-actions {
            flex-direction: column;
          }

          .action-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PendingPosts; 