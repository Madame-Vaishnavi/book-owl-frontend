import bookstoreLogo from '../../assets/logo.png';
import './BookstoreLogo.css';

const BookstoreLogo = () => {
  return (
    <div className="bookstore-logo">
      <img 
        src={bookstoreLogo} 
        alt="BOOKSTORE Logo" 
        className="logo-image"
      />
      <span className="company-name">Book Owls</span>
    </div>
  );
};

export default BookstoreLogo;

