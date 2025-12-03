import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { locationService } from '../services/locationService';
import './Dashboard.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAdmin } = useAuth();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
    address: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setRegisterError('');
    setRegisterSuccess('');
  };

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    setRegisterError('');
    try {
      const address = await locationService.getCurrentAddress();
      setRegisterFormData(prev => ({
        ...prev,
        address
      }));
    } catch (err) {
      setRegisterError(err.message || 'Failed to detect location. Please enter address manually.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (registerFormData.password !== registerFormData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    if (registerFormData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters long');
      return;
    }

    setRegisterLoading(true);

    try {
      const { confirmPassword, ...registerData } = registerFormData;
      const response = await authService.registerUser(registerData);
      
      if (response.success) {
        setRegisterSuccess(`${registerData.role === 'admin' ? 'Admin' : 'Member'} registered successfully!`);
        setRegisterFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'member',
          address: ''
        });
        setTimeout(() => {
          setShowRegisterForm(false);
          setRegisterSuccess('');
        }, 2000);
      } else {
        setRegisterError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Profile</h1>
          <p className="dashboard-subtitle">Your account information</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card profile-card">
          <div className="card-header">
            <div className="card-icon profile-icon">👤</div>
            <h2>Your Profile</h2>
          </div>
          <div className="profile-info">
            <div className="profile-item">
              <div className="profile-label-wrapper">
                <svg className="profile-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="profile-label">Name</span>
              </div>
              <span className="profile-value">{user?.name}</span>
            </div>
            <div className="profile-item">
              <div className="profile-label-wrapper">
                <svg className="profile-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span className="profile-label">Email</span>
              </div>
              <span className="profile-value">{user?.email}</span>
            </div>
            <div className="profile-item">
              <div className="profile-label-wrapper">
                <svg className="profile-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="profile-label">Role</span>
              </div>
              <span className={`profile-value role-badge ${user?.role}`}>
                {user?.role === 'admin' ? (
                  <>
                    Admin
                  </>
                ) : (
                  <>
                    Member
                  </>
                )}
              </span>
            </div>
            {user?.address && (
              <div className="profile-item">
                <div className="profile-label-wrapper">
                  <svg className="profile-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="profile-label">Address</span>
                </div>
                <span className="profile-value">{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {isAdmin() && (
          <div className="dashboard-card register-user-card">
            <div className="card-header">
              <div className="card-icon register-icon">➕</div>
              <h2>Register New User</h2>
            </div>
            
            {!showRegisterForm ? (
              <div className="register-user-action">
                <p>Register a new admin or member account</p>
                <button 
                  onClick={() => setShowRegisterForm(true)}
                  className="btn-register-toggle"
                >
                  Register User
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="register-user-form">
                {registerError && (
                  <div className="register-error-message">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {registerError}
                  </div>
                )}

                {registerSuccess && (
                  <div className="register-success-message">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {registerSuccess}
                  </div>
                )}

                <div className="register-form-group">
                  <label htmlFor="register-name">Full Name</label>
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    value={registerFormData.name}
                    onChange={handleRegisterChange}
                    required
                    minLength={2}
                    placeholder="Enter full name"
                    className="register-form-input"
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="register-email">Email Address</label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerFormData.email}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Enter email address"
                    className="register-form-input"
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="register-role">Role</label>
                  <select
                    id="register-role"
                    name="role"
                    value={registerFormData.role}
                    onChange={handleRegisterChange}
                    className="register-form-input"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="register-form-group">
                  <label htmlFor="register-address">Address</label>
                  <input
                    type="text"
                    id="register-address"
                    name="address"
                    value={registerFormData.address}
                    onChange={handleRegisterChange}
                    placeholder="Enter address"
                    className="register-form-input"
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      className="btn-locate-me"
                    >
                      {detectingLocation ? (
                        <>
                          <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', marginRight: '6px' }}></span>
                          Detecting...
                        </>
                      ) : (
                        'Locate Me'
                      )}
                    </button>
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="register-password">Password</label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    value={registerFormData.password}
                    onChange={handleRegisterChange}
                    required
                    minLength={6}
                    placeholder="Enter password (min 6 characters)"
                    className="register-form-input"
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="register-confirm-password">Confirm Password</label>
                  <input
                    type="password"
                    id="register-confirm-password"
                    name="confirmPassword"
                    value={registerFormData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Confirm password"
                    className="register-form-input"
                  />
                </div>

                <div className="register-form-actions">
                  <button 
                    type="submit" 
                    className="btn-register-submit"
                    disabled={registerLoading}
                  >
                    {registerLoading ? 'Registering...' : 'Register User'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowRegisterForm(false);
                      setRegisterError('');
                      setRegisterSuccess('');
                      setRegisterFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        role: 'member',
                        address: ''
                      });
                    }}
                    className="btn-register-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

