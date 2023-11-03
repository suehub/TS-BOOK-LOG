import React, { useState } from 'react';
import axios from 'axios';
import { type Book } from './PostWrite';

interface BookSearchModalProps {
  onClose: () => void;
  onSelectBook: (book: Book) => Promise<void>;
}

const BookSearchModal: React.FC<BookSearchModalProps> = ({
  onClose,
  onSelectBook,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  const baseURL = process.env.REACT_APP_NAVER_API_URL;

  const handleSearch = async (): Promise<void> => {
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      if (baseURL != null) {
        const response = await axios.get(
          `${baseURL}?query=${encodedSearchTerm}`,
          {
            headers: {
              'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
              'X-Naver-Client-Secret':
                process.env.REACT_APP_NAVER_CLIENT_SECRET,
            },
          }
        );
        setBooks(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  return (
    <div className="book-search-modal">
      <button onClick={onClose}>닫기</button>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <button
        onClick={() => {
          void handleSearch();
        }}
      >
        검색
      </button>

      <ul>
        {books.map((book, index) => (
          <li
            key={index}
            onClick={() => {
              void onSelectBook(book);
            }}
          >
            <img src={book.image} alt={book.title} />
            <div>
              <p>{book.title}</p>
              <p>{book.author}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSearchModal;
