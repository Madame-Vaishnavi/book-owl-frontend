import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/auth/PrivateRoute';
import './AdminBooksPage.css';

const AdminBooksPage = () => {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin()) {
      loadBooks();
    }
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      setBooks(response.data.books || []);
      setError(null);
    } catch (err) {
      setError('Failed to load books.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await bookService.deleteBook(id);
      loadBooks();
    } catch (err) {
      alert('Failed to delete book. Please try again.');
      console.error('Error deleting book:', err);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  if (!isAdmin()) {
    return (
      <div className="admin-books-container">
        <div className="error-banner">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-books-container">
        <div className="loading-spinner">Loading books...</div>
      </div>
    );
  }

  return (
    <PrivateRoute adminOnly={true}>
      <div className="admin-books-container">
        <div className="admin-books-header">
          <div>
            <h1>Manage Books</h1>
            <p className="admin-subtitle">Manage your library collection</p>
          </div>
          <Link to="/admin/books/new" className="btn-add-book">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Book
          </Link>
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
            <div className="empty-icon">📚</div>
            <h3>No books found</h3>
            <p>Start by adding a new book to your library!</p>
            <Link to="/admin/books/new" className="btn-add-book">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Book
            </Link>
          </div>
        ) : (
          <>
            <div className="search-section">
              <div className="search-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="clear-search"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="books-count-badge">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
              </div>
            </div>

            <div className="table-container">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>ISBN</th>
                    <th>Available</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-results">
                        <div className="no-results-content">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="48" height="48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>No books found matching your search</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map(book => (
                      <tr key={book._id}>
                        <td className="book-title-cell">
                          <div className="book-title-wrapper">
                            <span className="book-title">{book.title}</span>
                          </div>
                        </td>
                        <td>{book.author}</td>
                        <td>
                          <span className="category-tag">{book.category}</span>
                        </td>
                        <td className="isbn-cell">{book.isbn}</td>
                        <td>
                          <span className={`availability-tag ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                            {book.availableCopies}
                          </span>
                        </td>
                        <td>{book.totalCopies}</td>
                        <td className="actions-cell">
                          <Link 
                            to={`/admin/books/${book._id}/edit`} 
                            className="btn-action btn-edit"
                            title="Edit book"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(book._id, book.title)}
                            className="btn-action btn-delete"
                            title="Delete book"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default AdminBooksPage;
