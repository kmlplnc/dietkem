import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import aiDietImage from '../assets/blog/ai-diet.png';
import microbiomeImage from '../assets/blog/microbiome.png';
import digitalDietImage from '../assets/blog/digital-diet.png';
import { trpc } from '../utils/trpc';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image?: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const { currentLang } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [relatedImageErrors, setRelatedImageErrors] = useState<{ [key: string]: boolean }>({});

  // Fetch the post by ID using tRPC
  const { data: post, isLoading, isError } = trpc.blogs.getById.useQuery(id || '');

  // Fetch all published posts for related posts
  const { data: allPosts = [] } = trpc.blogs.getAll.useQuery();

  // Filter for related posts: published, not the current post
  const relatedPosts = allPosts.filter(
    p => p.status === 'published' && p.id !== id
  ).slice(0, 3);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleRelatedImageError = (postId: string) => {
    setRelatedImageErrors(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError || !post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="blog-post">
      <div className="page-container">
        <div className="navigation-buttons">
          <Link to="/blog" className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {currentLang === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}
          </Link>
        </div>

        <article className="post-content">
          <header className="post-header">
            <span className="category">{post.category}</span>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <div className="author">
                <div className="author-avatar">
                  {imageError ? (
                    <div className="default-avatar">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  ) : (
                    <img 
                      src="/images/author-avatar.jpg" 
                      alt={post.author}
                      onError={handleImageError}
                    />
                  )}
                </div>
                <span className="author-name">{post.author}</span>
              </div>
              <time className="post-date">{post.date}</time>
            </div>
          </header>

          <div className="post-image">
            <img 
              src={post.image} 
              alt={post.title}
              onError={handleImageError}
            />
          </div>

          <div className="post-body">
            <p>{post.content}</p>
          </div>
        </article>

        <section className="related-posts">
          <h2 className="section-title">
            {currentLang === 'tr' ? 'İlgili Yazılar' : 'Related Posts'}
          </h2>
          <div className="related-posts-grid">
            {relatedPosts.length === 0 ? (
              <div className="no-related-posts">
                {currentLang === 'tr' ? 'İlgili yazı bulunamadı.' : 'No related posts found.'}
              </div>
            ) : (
              relatedPosts.map((relatedPost) => (
                <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="related-post-card" style={{ textDecoration: 'none' }}>
                  <div className="related-post-image">
                    {relatedImageErrors[relatedPost.id] ? (
                      <div className="default-image">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    ) : (
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        onError={() => handleRelatedImageError(relatedPost.id)}
                      />
                    )}
                  </div>
                  <div className="related-post-content">
                    <span className="category">{relatedPost.category}</span>
                    <h3 className="related-post-title">{relatedPost.title}</h3>
                    <div className="related-post-meta">
                      <span className="author">{relatedPost.author}</span>
                      <span className="date">{relatedPost.date}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        .blog-post {
          padding: 2rem;
          background: #f9fafb;
          min-height: 100vh;
        }

        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 64px;
        }

        .navigation-buttons {
          margin-bottom: 1.5rem;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .back-button:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .back-button svg {
          color: #6b7280;
        }

        .post-content {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .post-header {
          padding: 2rem;
          text-align: center;
        }

        .category {
          display: inline-block;
          background: #f3f4f6;
          color: #1f2937;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 1rem;
          border: 1px solid #e5e7eb;
        }

        .post-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .post-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: #f3f4f6;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .default-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .default-avatar svg {
          width: 24px;
          height: 24px;
        }

        .post-image {
          width: 100%;
          height: 400px;
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
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          gap: 0.5rem;
        }

        .default-image svg {
          width: 48px;
          height: 48px;
        }

        .post-body {
          padding: 2rem;
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4b5563;
        }

        .related-posts {
          margin-top: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .related-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .related-post-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .related-post-card:hover {
          transform: translateY(-4px);
        }

        .related-post-image {
          width: 100%;
          height: 200px;
          background: #f3f4f6;
          position: relative;
        }

        .related-post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .related-post-content {
          padding: 1.5rem;
        }

        .related-post-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0.75rem 0;
          line-height: 1.4;
        }

        .related-post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 1.125rem;
          color: #6b7280;
        }

        .error {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
          font-size: 1.125rem;
        }

        .no-related-posts {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .blog-post {
            padding: 1rem;
          }

          .post-header {
            padding: 1.5rem;
          }

          .post-title {
            font-size: 2rem;
          }

          .post-image {
            height: 300px;
          }

          .post-body {
            padding: 1.5rem;
            font-size: 1rem;
          }

          .related-posts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPost; 