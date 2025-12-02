import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CollectionsPage from './pages/CollectionsPage';
import BookDetail from './pages/BookDetail';
import AdminBooksPage from './pages/AdminBooksPage';
import BookForm from './pages/BookForm';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/collections"
                element={
                  <PrivateRoute adminOnly={true}>
                    <CollectionsPage />
                  </PrivateRoute>
                }
              />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route
                path="/admin/books"
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminBooksPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/books/new"
                element={
                  <PrivateRoute adminOnly={true}>
                    <BookForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/books/:id/edit"
                element={
                  <PrivateRoute adminOnly={true}>
                    <BookForm />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
