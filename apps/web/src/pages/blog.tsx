import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '../context/LanguageContext';
import SearchBox from '../components/SearchBox';
import NewPostForm from '../components/NewPostForm';

// Import images
import aiDietImage from '../assets/blog/ai-diet.png';
import microbiomeImage from '../assets/blog/microbiome.png';
import digitalDietImage from '../assets/blog/digital-diet.png';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  image: string;
  status: 'pending' | 'published' | 'rejected';
}

const BlogPage = () => {
  const { currentLang } = useLanguage();
  const { user } = useUser();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Sample blog posts (replace with actual data from API)
  const [posts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Yapay Zeka ile Diyet Planlaması',
      summary: 'Yapay zeka teknolojilerinin diyet planlamasında kullanımı ve avantajları.',
      category: 'AI',
      author: 'Dr. Mehmet Yılmaz',
      date: '2024-03-15',
      image: aiDietImage,
      status: 'published'
    },
    {
      id: '2',
      title: 'Bağırsak Mikrobiyomu ve Beslenme',
      summary: 'Bağırsak sağlığı ve mikrobiyom üzerine güncel araştırmalar.',
      category: 'Bilimsel',
      author: 'Prof. Ayşe Demir',
      date: '2024-03-10',
      image: microbiomeImage,
      status: 'published'
    },
    {
      id: '3',
      title: 'Dijital Diyetisyenlik',
      summary: 'Modern diyetisyenlik pratiklerinde dijital araçların kullanımı.',
      category: 'Uygulama',
      author: 'Uzm. Dyt. Zeynep Kaya',
      date: '2024-03-05',
      image: digitalDietImage,
      status: 'published'
    }
  ]);

  const categories = [
    { id: 'AI', label: 'AI' },
    { id: 'Bilimsel', label: 'Bilimsel' },
    { id: 'Uygulama', label: 'Uygulama' },
    { id: 'Danışan', label: 'Danışan' }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewPost = async () => {
    try {
      // API call to create new post
      // await createPost(postData);
      setShowNewPostForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory && post.status === 'published';
  });

  return (
    <div className="blog-page">
      <div className="container">
        <div className="navigation-buttons">
          <Link to="/" className="home-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {currentLang === 'tr' ? 'Ana Sayfa' : 'Home'}
          </Link>
        </div>

        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              {currentLang === 'tr' ? 'Dietkem Blog' : 'Dietkem Blog'}
            </h1>
            <p className="hero-subtitle">
              {currentLang === 'tr'
                ? 'Bilimsel makaleler, güncel araştırmalar ve diyetisyenlik pratikleri'
                : 'Scientific articles, current research, and dietitian practices'}
            </p>
          </div>
        </div>

        <div className="blog-header">
          <SearchBox onSearch={handleSearch} />
          
          <div className="category-filters">
            <button
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              {currentLang === 'tr' ? 'Tümü' : 'All'}
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {user && (
            <button
              className="new-post-btn"
              onClick={() => setShowNewPostForm(true)}
            >
              {currentLang === 'tr' ? 'Yeni Yazı Ekle' : 'Add New Post'}
            </button>
          )}
        </div>

        {showNewPostForm && (
          <div className="new-post-modal">
            <div className="modal-content">
              <button
                className="close-btn"
                onClick={() => setShowNewPostForm(false)}
              >
                ×
              </button>
              <NewPostForm onSubmit={handleNewPost} />
            </div>
          </div>
        )}

        <div className="blog-grid">
          {filteredPosts.map(post => (
            <Link to={`/blog/${post.id}`} key={post.id} className="blog-card">
              <div className="card-image">
                <img src={post.image} alt={post.title} />
                <span className="category-tag">{post.category}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{post.title}</h3>
                <p className="card-summary">{post.summary}</p>
                <div className="card-meta">
                  <span className="author">{post.author}</span>
                  <span className="date">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .blog-page {
          padding: 2rem;
          background: #f9fafb;
          min-height: 100vh;
        }

        .navigation-buttons {
          margin-bottom: 1.5rem;
        }

        .home-button {
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

        .home-button:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .home-button svg {
          color: #6b7280;
        }

        .hero {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 4rem 2rem;
          text-align: center;
          color: #374151;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #4b5563;
          opacity: 0.9;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .blog-header {
          margin-bottom: 2rem;
        }

        .category-filters {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          background: white;
          color: #4b5563;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-btn:hover {
          border-color: #9ca3af;
          color: #1f2937;
        }

        .category-btn.active {
          background: #f3f4f6;
          color: #1f2937;
          border-color: #9ca3af;
        }

        .new-post-btn {
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .new-post-btn:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .new-post-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          position: relative;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid #e5e7eb;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          line-height: 1;
        }

        .close-btn:hover {
          color: #1f2937;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .blog-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
          border: 1px solid #e5e7eb;
        }

        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.1);
          border-color: #9ca3af;
        }

        .card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-tag {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(243, 244, 246, 0.9);
          color: #1f2937;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid #e5e7eb;
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .card-summary {
          font-size: 0.875rem;
          color: #4b5563;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 3rem 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .container {
            padding: 1rem;
          }

          .blog-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .category-filters {
            gap: 0.5rem;
          }

          .category-btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPage; 