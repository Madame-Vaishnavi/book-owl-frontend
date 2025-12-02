import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/auth/PrivateRoute';
import './BookForm.css';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Others',
    publishedYear: new Date().getFullYear(),
    availableCopies: 0,
    totalCopies: 1
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(isEditMode);

  const categories = ['Fiction', 'Non Fiction', 'Science', 'History', 'Technology', 'Arts', 'Others'];

  useEffect(() => {
    if (isEditMode) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      setLoadingBook(true);
      const response = await bookService.getBookById(id);
      const book = response.data.book;
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || 'Others',
        publishedYear: book.publishedYear || new Date().getFullYear(),
        availableCopies: book.availableCopies || 0,
        totalCopies: book.totalCopies || 1
      });
    } catch (err) {
      setError('Failed to load book details.');
      console.error('Error loading book:', err);
    } finally {
      setLoadingBook(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' || name === 'availableCopies' || name === 'totalCopies'
        ? parseInt(value) || 0
        : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.author.trim()) {
      setError('Author is required');
      return false;
    }
    if (!formData.isbn.trim()) {
      setError('ISBN is required');
      return false;
    }
    if (!/^\d{10,13}$/.test(formData.isbn)) {
      setError('ISBN must be 10-13 digits');
      return false;
    }
    if (formData.availableCopies > formData.totalCopies) {
      setError('Available copies cannot exceed total copies');
      return false;
    }
    if (formData.totalCopies < 1) {
      setError('Total copies must be at least 1');
      return false;
    }
    if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear()) {
      setError('Published year must be valid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await bookService.updateBook(id, formData);
      } else {
        await bookService.createBook(formData);
      }
      navigate('/admin/books');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors?.join(', ')) ||
                          'Failed to save book. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="book-form-container">
        <div className="error-banner">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  if (loadingBook) {
    return (
      <div className="book-form-container">
        <div className="loading-spinner">Loading book details...</div>
      </div>
    );
  }

  return (
    <PrivateRoute adminOnly={true}>
      <div className="book-form-container">
        <div className="book-form-header">
          <div>
            <h1>{isEditMode ? 'Edit Book' : 'Add New Book'}</h1>
            <p className="form-subtitle">
              {isEditMode ? 'Update book information' : 'Fill in the details to add a new book'}
            </p>
          </div>
          <Link to="/admin/books" className="btn-back">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Books
          </Link>
        </div>

        <div className="book-form-card">
          <form onSubmit={handleSubmit} className="book-form">
            {error && (
              <div className="error-message">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="Enter book title"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="author">
                    Author <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="Enter author name"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Book Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="isbn">
                    ISBN <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    pattern="\d{10,13}"
                    placeholder="10-13 digits"
                    className="form-input"
                    disabled={isEditMode}
                  />
                  {isEditMode && (
                    <small className="form-hint">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ISBN cannot be changed
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category">
                    Category <span className="required">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="publishedYear">
                    Published Year <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="publishedYear"
                    name="publishedYear"
                    value={formData.publishedYear}
                    onChange={handleChange}
                    required
                    min="1000"
                    max={new Date().getFullYear()}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Inventory</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalCopies">
                    Total Copies <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="totalCopies"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    required
                    min="1"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availableCopies">
                    Available Copies <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="availableCopies"
                    name="availableCopies"
                    value={formData.availableCopies}
                    onChange={handleChange}
                    required
                    min="0"
                    max={formData.totalCopies}
                    className="form-input"
                  />
                  <small className="form-hint">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cannot exceed total copies ({formData.totalCopies})
                  </small>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin/books')}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update Book
                      </>
                    ) : (
                      <>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Book
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default BookForm;
