import { Timestamp, addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/Authcontext';
import { db } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';
import BookSearchModal from './BookSearchModal';
import { StyledBook } from './PostEdit';
import Swal from 'sweetalert2';

export const Div = styled.div`
  margin: 0 auto;
  > form {
    width: 85%;
    min-height: 82vh;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    input[type='text'] {
      width: 50%;
      padding: 0.1rem 0.2rem;
      background-color: inherit;
      border: none;
      border-bottom: 3px solid #a5a5a5;
      font-family: NotoSansKR-SemiBold;
      font-size: 2rem;
      &:focus {
        outline: none;
      }
    }
    .file-name {
      font-family: NotoSansKR-Medium;
      padding-left: 0.1rem;
    }
    .title {
      margin-top: 0.2rem;
      display: flex;
      align-items: flex-end;
      .image-add--icon {
        width: inherit;
        margin-left: 1rem;
        padding: 0.2rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid #a5a5a5;
        color: #a5a5a5;
        border-radius: 10px;
        transition: all 0.8s;
        &:hover {
          transform: scale(1.03);
          transition: all 0.8s;
        }
        > span {
          margin-left: 0.2rem;
          font-family: NotoSansKR-Medium;
          font-size: 0.8rem;
        }
      }
    }
  }
  .quill {
    margin: 1rem 0 4rem 0;
    height: 25rem;
  }
  .ql-toolbar {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #f1f2f3;
  }
  .ql-container {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    font-family: NotoSansKR-Regular;
    font-size: 1rem;
    strong {
      font-weight: 700;
    }
  }
`;

export const PostButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    button:first-of-type {
      margin-right: 1rem;
    }
  }
  button {
    padding: 0.6rem 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: NotoSansKR-Medium;
    font-size: 1.2rem;
    background-color: inherit;
    border-radius: 8px;
    border: 2px solid #404040;

    > span {
      margin-left: 0.3rem;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  .post-button {
    background-color: #000;
    color: #fff;
    &:hover {
      background-color: #404040;
    }
  }
`;

export interface Book {
  title: string;
  link: string;
  image: string;
  author: string;
  pubdate: string;
}

interface Post {
  title: string;
  content: string;
  createdAt: Timestamp;
  authorId: string | undefined;
  authorProfileImage?: string;
  authorName?: string;
  likesCount: number;
  bookTitle: string;
  bookLink: string;
  bookImage: string;
  bookAuthor: string;
  bookPubDate: string;
}

const PostWrite: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [user, setUser] = useState<{
    uid: string;
    profileImage: string;
    name: string;
  } | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // 책 선택 핸들러
  const handleSelectBook = async (book: Book): Promise<void> => {
    // 책 정보를 상태에 저장
    setSelectedBook({
      title: book.title,
      link: book.link,
      image: book.image,
      author: book.author,
      pubdate: book.pubdate,
    });
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (currentUser != null) {
      setUser({
        uid: currentUser.uid ?? '',
        profileImage: currentUser.photoURL ?? '',
        name: currentUser.displayName ?? '',
      });
    } else {
      setUser(null);
    }
    return () => {
      setUser(null);
    };
  }, [currentUser]);

  const handleWrite = async (): Promise<void> => {
    try {
      const postsCollection = collection(db, 'posts');

      // 제목과 내용이 있을 때만 포스트 저장
      if (title !== '' && content !== '' && selectedBook != null) {
        const postData: Post = {
          title,
          content,
          createdAt: Timestamp.now(),
          authorId: user?.uid,
          authorProfileImage: user?.profileImage,
          authorName: user?.name,
          likesCount: 0,
          bookTitle: selectedBook?.title,
          bookLink: selectedBook?.link,
          bookImage: selectedBook?.image,
          bookAuthor: selectedBook?.author,
          bookPubDate: selectedBook?.pubdate,
        };
        // 포스트 데이터베이스에 추가
        await addDoc(postsCollection, postData);

        void Swal.fire('북로그', '북로그가 업로드되었습니다.', 'success');
        navigate('/');
      } else {
        void Swal.fire(
          '북로그 작성',
          '책을 선택하고 제목과 글을 입력해주세요.',
          'error'
        );
      }
    } catch (error) {
      void Swal.fire('북로그', '북로그가 업로드에 실패하였습니다.', 'error');
      console.error('Error saving post: ', error);
    }
  };

  const formatDate = (dateString: string): string => {
    return dateString.replace(
      /^(\d{4})(\d{2})(\d{2})$/,
      (match, year, month, day) => `${year}-${month}-${day}`
    );
  };

  return (
    <Div>
      <Header />
      <form>
        <PostButton>
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <BiArrowBack size={25} />
            <span>나가기</span>
          </button>
          <div>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              책 검색
            </button>
            <button
              onClick={() => {
                void handleWrite();
              }}
              className="post-button"
              type="button"
            >
              출간하기
            </button>
          </div>
        </PostButton>

        {selectedBook != null && (
          <StyledBook className="book">
            <div>
              {selectedBook?.image != null && (
                <img src={selectedBook?.image} alt="content image" />
              )}
            </div>
            <div className="book-desc">
              <p>{selectedBook?.title}</p>
              <span>{selectedBook?.author}</span>
              <span>{formatDate(selectedBook?.pubdate)}</span>
            </div>
          </StyledBook>
        )}

        <div className="title">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="제목을 입력하세요"
          />
        </div>

        <ReactQuill theme="snow" value={content} onChange={setContent} />
      </form>

      {isModalOpen && (
        <BookSearchModal
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSelectBook={handleSelectBook}
        />
      )}

      <Footer />
    </Div>
  );
};

export default PostWrite;
