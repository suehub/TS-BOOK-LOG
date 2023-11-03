import axios from 'axios';
import React, { useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineClose } from 'react-icons/md';
import styled from 'styled-components';
import { type Book } from './PostWrite';

interface BookSearchModalProps {
  onClose: () => void;
  onSelectBook: (book: Book) => Promise<void>;
}

const Div = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
  > form {
    width: 50vw;
    height: 90%;
    max-height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: 20px;
    z-index: 99;
    font-family: NotoSansKR-Medium;
    .close-button {
      margin: 1.25rem 1.25rem 0.8rem 1.25rem;
      margin-left: auto;
      border: none;
      background: none;
      cursor: pointer;
    }
    .search {
      width: 83%;
      margin: 0 auto;
      max-height: 100%;
      .input-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 2px solid #a5a5a5;
        border-radius: 2rem;
        background-color: #f8f9fa;
        .search-icon {
          margin: 0 1rem;
        }
        .input-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          input {
            width: 100%;
            padding: 0.8rem 0;
            font-family: NotoSansKR-Medium;
            font-size: 1.1rem;
            outline: none;
            border: none;
            border-radius: 2rem;
            background-color: inherit;
          }
          button {
            border: none;
            border-left: 2px solid #a5a5a5;
            padding: 0.8rem 1rem;
            white-space: nowrap;
            background: inherit;
            border-top-right-radius: 2rem;
            border-bottom-right-radius: 2rem;
            font-family: NotoSansKR-Medium;
            font-size: 1.1rem;

            &:hover {
              background-color: rgb(0, 0, 0, 0.06);
            }
          }
        }
      }
      ul {
        width: 98%;
        height: 70%;
        margin: 1rem auto;
        overflow-y: scroll;
        border-radius: 4px;
        > li {
          width: 100%;
          margin: 0.5rem 0;
          display: flex;
          justify-content: flex-start;
          border-radius: 4px;
          border: 1px solid #a5a5a5;
          cursor: pointer;
        }
        img {
          width: 10rem;
          object-fit: contain;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        .desc {
          margin: 1.5rem;
        }
        .title {
          font-size: 1.3rem;
        }
        .author {
          margin: 1rem 0;
        }
        .pubdate {
          font-family: NotoSansKR-Regular;
        }
      }
    }
  }
`;

const BookSearchModal: React.FC<BookSearchModalProps> = ({
  onClose,
  onSelectBook,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  const modalBackgroundRef = useRef<HTMLDivElement>(null);

  const baseURL = process.env.REACT_APP_NAVER_API_URL;

  const handleClickBackground = async (
    e: React.MouseEvent<HTMLDivElement>
  ): Promise<void> => {
    if (e.target === modalBackgroundRef.current) {
      onClose();
    }
  };

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      if (baseURL != null) {
        const response = await axios.get(
          `${baseURL}?query=${encodedSearchTerm}&display=15`,
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

  const formatDate = (dateString: string): string => {
    return dateString.replace(
      /^(\d{4})(\d{2})(\d{2})$/,
      (match, year, month, day) => `${year}-${month}-${day}`
    );
  };

  return (
    <Div
      onClick={(e) => {
        void handleClickBackground(e);
      }}
      ref={modalBackgroundRef}
    >
      <form
        onSubmit={(e) => {
          void handleSearch(e);
        }}
      >
        <button className="close-button" type="button" onClick={onClose}>
          <MdOutlineClose size={35} />
        </button>
        <div className="search">
          <div className="input-wrapper">
            <AiOutlineSearch className="search-icon" size={27} />
            <div className="input-item">
              <input
                type="text"
                placeholder="책 제목을 입력해주세요"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <button type="submit">검색</button>
            </div>
          </div>

          <ul>
            {books.map((book, index) => (
              <li
                key={index}
                onClick={() => {
                  void onSelectBook(book);
                }}
              >
                <img src={book.image} alt={book.title} />
                <div className="desc">
                  <p className="title">{book.title}</p>
                  <p className="author">{book.author}</p>
                  <p className="pubdate">{formatDate(book.pubdate)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </Div>
  );
};

export default BookSearchModal;
