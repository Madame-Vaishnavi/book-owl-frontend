import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      setBook(response.data.book);
      setError(null);
    } catch (err) {
      setError('Failed to load book details.');
      console.error('Error loading book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookService.deleteBook(id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete book. Please try again.');
      console.error('Error deleting book:', err);
    }
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <div className="loading-spinner">Loading book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-container">
        <div className="error-banner">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error || 'Book not found'}
        </div>
        <Link to="/" className="btn-back">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <Link to="/" className="btn-back">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Books
      </Link>

      <div className="book-detail-content">
        <div className="book-detail-main">
          <div className="book-detail-header">
            <div className="book-badges">
              <span className="book-category-badge">{book.category}</span>
              <span className={`availability-badge ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                <span className="availability-dot"></span>
                {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
              </span>
            </div>
            {isAdmin() && (
              <div className="admin-actions">
                <Link to={`/admin/books/${id}/edit`} className="btn-action btn-edit">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Book
                </Link>
                <button onClick={handleDelete} className="btn-action btn-delete">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Book
                </button>
              </div>
            )}
          </div>

          <div className="book-detail-body">
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">by {book.author}</p>

            <div className="book-stats">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <span className="stat-label">Total Copies</span>
                  <span className="stat-value">{book.totalCopies}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <span className="stat-label">Available</span>
                  <span className="stat-value">{book.availableCopies}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <span className="stat-label">Borrowed</span>
                  <span className="stat-value">{book.totalCopies - book.availableCopies}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="book-detail-sidebar">
          <div className="info-card">
            <h3 className="info-card-title">Book Information</h3>
            <div className="info-list">
              <div className="info-item">
                <div className="info-item-header">
                  <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="info-label">ISBN</span>
                </div>
                <span className="info-value">{book.isbn}</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="info-label">Category</span>
                </div>
                <span className="info-value">{book.category}</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="info-label">Published Year</span>
                </div>
                <span className="info-value">{book.publishedYear}</span>
              </div>
            </div>
          </div>

          <div className="availability-card">
            <div className="availability-header">
              <h3>Availability Status</h3>
            </div>
            <div className="availability-content">
              <div className={`availability-indicator ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                <span className="indicator-dot"></span>
                <span className="indicator-text">
                  {book.availableCopies > 0 
                    ? `${book.availableCopies} copy${book.availableCopies !== 1 ? 'ies' : ''} available`
                    : 'Currently unavailable'
                  }
                </span>
              </div>
              <div className="availability-progress">
                <div 
                  className="availability-bar"
                  style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
