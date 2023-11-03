import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { type Post } from '../home/PostList';
import { type Book, Div } from './PostWrite';
import BookSearchModal from './BookSearchModal';

const PostEdit: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [title, setTitle] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [hasTitleChanged, setHasTitleChanged] = useState<boolean>(false);
  const [hasContentChanged, setHasContentChanged] = useState<boolean>(false);

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
          if (postData.bookImage !== undefined) {
            setImagePreview(postData.bookImage);
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
    setIsModalOpen(false);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const selectedFile = e.target.files?.[0];
  //   if (selectedFile != null) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(selectedFile);
  //     setHasImageChanged(true);
  //   }
  // };

  const updatePost = async (): Promise<void> => {
    if (id == null) return;

    const postRef = doc(db, 'posts', id);

    const updatedData: Partial<Post> = {};

    if (hasTitleChanged) {
      updatedData.title = title;
    }

    updatedData.bookImage = selectedBook?.image;

    if (hasContentChanged) {
      updatedData.content = content;
    }

    try {
      await updateDoc(postRef, updatedData);
      alert('포스트가 성공적으로 수정되었습니다!');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('포스트 수정에 실패하였습니다.');
    }
  };

  return (
    <Div>
      <Header />
      <form>
        <div className="button-wrapper">
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <BiArrowBack size={25} />
            <span>나가기</span>
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

        <div className="title">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasTitleChanged(true);
            }}
          />

          <div className="button-wrapper">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              책 검색
            </button>
          </div>
        </div>

        {selectedBook !== null && (
          <div>
            <img src={selectedBook.image ?? imagePreview} alt="미리보기" />
          </div>
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
