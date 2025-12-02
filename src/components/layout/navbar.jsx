import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookstoreLogo from './BookstoreLogo';
import './navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <BookstoreLogo />
        </Link>
        
        <div className="navbar-center">
          {isAuthenticated && !isAdmin() && (
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          )}
          
          {isAuthenticated && (
            <>
              {isAdmin() ? (
                <>
                  <Link 
                    to="/collections" 
                    className={`navbar-link ${isActive('/collections') ? 'active' : ''}`}
                  >
                    Collections
                  </Link>
                  <Link 
                    to="/admin/books/new" 
                    className={`navbar-link ${isActive('/admin/books/new') ? 'active' : ''}`}
                  >
                    Add Book
                  </Link>
                  <Link 
                    to="/admin/books" 
                    className={`navbar-link ${isActive('/admin/books') ? 'active' : ''}`}
                  >
                    Manage
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <Link 
                  to="/profile" 
                  className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              )}
            </>
          )}
        </div>
        
        <div className="navbar-right">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn-nav btn-nav-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn-nav btn-nav-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
