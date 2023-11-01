import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { BiArrowBack, BiImageAdd } from 'react-icons/bi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/Authcontext';
import { db, storage } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';

const Div = styled.div`
  margin: 0 auto;
  > form {
    width: 95%;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    input[type='text'] {
      width: 40%;
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
      input[type='file'] {
        display: none;
      }
      label {
        width: 9rem;
      }
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
    img {
      width: 15rem;
      height: 10rem;
      margin-top: 0.5rem;
      object-fit: cover;
      border: 1px solid #000;
      border-radius: 10px;
    }
  }
  .quill {
    margin: 1rem 0 4rem 0;
    height: 30rem;
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
  }

  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > button {
      padding: 0.6rem 1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: NotoSansKR-Medium;
      font-size: 1.2rem;
      background-color: inherit;
      border-radius: 8px;
      border: none;
      > span {
        padding-left: 0.2rem;
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
  }
`;

const PostWrite: React.FC = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [user, setUser] = useState<{
    uid: string;
    profileImage: string;
    name: string;
  } | null>(null);

  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState('');

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile != null) {
      setFileName(selectedFile.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleWrite = async (): Promise<void> => {
    let imageURL: string | undefined;

    try {
      // 이미지 저장
      if (file != null && fileName != null) {
        const storageRef = ref(storage, `images/${fileName}`);
        const uploadSnapshot = await uploadBytesResumable(storageRef, file);
        imageURL = await getDownloadURL(uploadSnapshot.ref);
      }
      const postsCollection = collection(db, 'posts');

      if (title !== '' && content !== '') {
        // 포스트 저장
        if (imageURL != null) {
          await addDoc(postsCollection, {
            title,
            image: imageURL,
            content,
            createdAt: Timestamp.now(),
            authorId: user?.uid,
            authorProfileImage: user?.profileImage,
            authorName: user?.name,
          });
        } else {
          await addDoc(postsCollection, {
            title,
            content,
            createdAt: Timestamp.now(),
            authorId: user?.uid,
            authorProfileImage: user?.profileImage,
            authorName: user?.name,
          });
        }
        alert('북로그가 업로드되었습니다.');
        navigate('/');
      } else {
        alert('제목과 글을 입력해주세요');
      }
    } catch (error) {
      console.error('Error saving post: ', error);
      alert('북로그 업로드에 실패하였습니다.');
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
              void handleWrite();
            }}
            className="post-button"
            type="button"
          >
            출간하기
          </button>
        </div>

        <div className="title">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="제목을 입력하세요"
          />

          <label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div className="image-add--icon">
              <BiImageAdd size={25} />
              <span>대표 이미지 선택</span>
            </div>
          </label>
        </div>

        {imagePreview != null && (
          <div>
            <img src={imagePreview} alt="미리보기" />
            <p className="file-name">{fileName}</p>
          </div>
        )}

        <ReactQuill theme="snow" value={content} onChange={setContent} />
      </form>

      <Footer />
    </Div>
  );
};

export default PostWrite;
