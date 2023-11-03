import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { type Post } from '../home/PostList';
import BookSearchModal from './BookSearchModal';
import { BookDesc } from './PostDetail';
import { Div, PostButton, type Book } from './PostWrite';

export const StyledBook = styled(BookDesc)`
  width: 50%;
  margin: 1rem 0;
  margin-right: auto;
  cursor: default;
  div {
    img {
      width: 70%;
    }
  }
`;

const PostEdit: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [hasTitleChanged, setHasTitleChanged] = useState<boolean>(false);
  const [hasContentChanged, setHasContentChanged] = useState<boolean>(false);
  const [hasBookChanged, setHasBookChanged] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      const postRef = doc(collection(db, 'posts'), id);

      try {
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          const postData = postDoc.data() as Post;
          if (postData.title !== undefined) {
            setTitle(postData.title);
          }
          if (postData.bookTitle !== '') {
            setSelectedBook({
              title: postData.bookTitle,
              link: postData.bookLink,
              image: postData.bookImage,
              author: postData.bookAuthor,
              pubdate: postData.bookPubDate,
            });
          }

          if (postData.content !== undefined) {
            setContent(postData.content);
          }
        } else {
          console.error('No such post found!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    void fetchPost();
  }, [id]);

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
    setHasBookChanged(true);
    setIsModalOpen(false);
  };

  const updatePost = async (): Promise<void> => {
    if (id == null) return;

    const postRef = doc(db, 'posts', id);

    const updatedData: Partial<Post> = {};

    if (hasTitleChanged) {
      updatedData.title = title;
    }

    if (hasBookChanged) {
      updatedData.bookTitle = selectedBook?.title;
      updatedData.bookLink = selectedBook?.link;
      updatedData.bookImage = selectedBook?.image;
      updatedData.bookAuthor = selectedBook?.author;
      updatedData.bookPubDate = selectedBook?.pubdate;
    }

    if (hasContentChanged) {
      updatedData.content = content;
    }

    try {
      await updateDoc(postRef, updatedData);
      alert('북로그가 수정되었습니다.');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('북로그 수정에 실패하였습니다.');
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
                void updatePost();
              }}
              className="post-button"
              type="button"
            >
              수정하기
            </button>
          </div>
        </PostButton>

        <div className="title">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasTitleChanged(true);
            }}
          />
        </div>

        {selectedBook !== null && (
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

        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => {
            setContent(value);
            setHasContentChanged(true);
          }}
        />
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

export default PostEdit;
