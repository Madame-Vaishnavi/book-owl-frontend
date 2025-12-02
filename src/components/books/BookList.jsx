import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import '../../pages/Home.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    author: ''
  });

  const categories = ['Fiction', 'Non Fiction', 'Science', 'History', 'Technology', 'Arts', 'Others'];

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks(filters);
      setBooks(response.data.books || []);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      author: ''
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.author;

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="hero-title">Discover Your Next Great Read</h1>
        <p className="hero-subtitle">Explore our curated collection of books</p>
      </div>

      <div className="filters-section">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="search"
            placeholder="Search by title or author..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="category" className="filter-label">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="author" className="filter-label">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Filter by author..."
              value={filters.author}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-clear-filters">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h3>No books found</h3>
          <p>Try adjusting your search filters to find what you're looking for.</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="books-header">
            <h2 className="books-count">
              {books.length} {books.length === 1 ? 'Book' : 'Books'} Found
            </h2>
          </div>
          <div className="books-grid">
            {books.map(book => (
              <Link to={`/books/${book._id}`} key={book._id} className="book-card">
                <div className="book-card-header">
                  <span className="book-category-badge">{book.category}</span>
                  <span className={`book-availability-badge ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                    {book.availableCopies > 0 ? (
                      <>
                        <span className="availability-dot"></span>
                        Available
                      </>
                    ) : (
                      <>
                        <span className="availability-dot"></span>
                        Unavailable
                      </>
                    )}
                  </span>
                </div>
                <div className="book-card-body">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta">
                    <div className="meta-item">
                      <span className="meta-label">Year</span>
                      <span className="meta-value">{book.publishedYear}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">ISBN</span>
                      <span className="meta-value">{book.isbn}</span>
                    </div>
                  </div>
                </div>
                <div className="book-card-footer">
                  <div className="copies-info">
                    <span className="copies-available">{book.availableCopies}</span>
                    <span className="copies-separator">/</span>
                    <span className="copies-total">{book.totalCopies}</span>
                    <span className="copies-label">copies</span>
                  </div>
                  <div className="book-card-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookList;

