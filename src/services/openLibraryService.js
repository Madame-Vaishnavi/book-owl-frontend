/**
 * Open Library API Service
 * Free API for fetching book information by ISBN
 * Documentation: https://openlibrary.org/developers/api
 */

export const openLibraryService = {
  /**
   * Fetch book details by ISBN
   * @param {string} isbn - ISBN number (10 or 13 digits)
   * @returns {Promise<Object>} Book details object
   */
  getBookByISBN: async (isbn) => {
    try {
      // Clean ISBN (remove dashes and spaces)
      const cleanISBN = isbn.replace(/[-\s]/g, '');
      
      // Validate ISBN format
      if (!/^\d{10,13}$/.test(cleanISBN)) {
        throw new Error('ISBN must be 10-13 digits');
      }

      // Open Library API endpoint
      const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&format=json&jscmd=data`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch book information');
      }

      const data = await response.json();
      const bookKey = `ISBN:${cleanISBN}`;
      
      if (!data[bookKey]) {
        throw new Error('Book not found. Please check the ISBN and try again.');
      }

      const bookData = data[bookKey];
      
      // Extract and format book information
      const bookInfo = {
        title: bookData.title || '',
        author: bookData.authors && bookData.authors.length > 0
          ? bookData.authors.map(author => author.name).join(', ')
          : '',
        isbn: cleanISBN,
        publishedYear: extractPublishedYear(bookData),
        category: mapCategory(bookData),
        // Note: totalCopies and availableCopies are not provided by API
        // Admin will need to enter these manually
      };

      return bookInfo;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch book information');
    }
  }
};

/**
 * Extract published year from book data
 * @param {Object} bookData - Book data from Open Library API
 * @returns {number} Published year
 */
function extractPublishedYear(bookData) {
  if (bookData.publish_date) {
    // Try to extract year from publish_date (format can vary)
    const yearMatch = bookData.publish_date.match(/\d{4}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      const currentYear = new Date().getFullYear();
      if (year >= 1000 && year <= currentYear) {
        return year;
      }
    }
  }
  
  // Fallback to current year if not found
  return new Date().getFullYear();
}

/**
 * Map Open Library subjects/categories to our category system
 * @param {Object} bookData - Book data from Open Library API
 * @returns {string} Category
 */
function mapCategory(bookData) {
  const categories = ['Fiction', 'Non Fiction', 'Science', 'History', 'Technology', 'Arts', 'Others'];
  
  if (!bookData.subjects || bookData.subjects.length === 0) {
    return 'Others';
  }

  // Get all subjects as lowercase for matching
  const subjects = bookData.subjects.map(s => 
    typeof s === 'string' ? s.toLowerCase() : (s.name || '').toLowerCase()
  ).join(' ');

  // Map subjects to our categories
  if (subjects.includes('fiction') || subjects.includes('novel')) {
    return 'Fiction';
  }
  if (subjects.includes('science') || subjects.includes('scientific')) {
    return 'Science';
  }
  if (subjects.includes('history') || subjects.includes('historical')) {
    return 'History';
  }
  if (subjects.includes('technology') || subjects.includes('computer') || subjects.includes('programming')) {
    return 'Technology';
  }
  if (subjects.includes('art') || subjects.includes('music') || subjects.includes('design')) {
    return 'Arts';
  }
  if (subjects.includes('non-fiction') || subjects.includes('biography') || subjects.includes('autobiography')) {
    return 'Non Fiction';
  }

  return 'Others';
}

