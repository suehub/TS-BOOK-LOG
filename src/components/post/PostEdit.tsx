import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { BiArrowBack, BiImageAdd } from 'react-icons/bi';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { type Post } from './PostDetail';
import { Div } from './PostWrite';

const PostEdit: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const [hasTitleChanged, setHasTitleChanged] = useState<boolean>(false);
  const [hasImageChanged, setHasImageChanged] = useState<boolean>(false);
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
          if (postData.image !== undefined) {
            setImagePreview(postData.image);
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
      setHasImageChanged(true);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log(snapshot.state, '... Success to Image Update !');
        },
        (error) => {
          reject(error);
        },
        () => {
          void (async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          })();
        }
      );
    });
  };

  const updatePost = async (): Promise<void> => {
    if (id == null) return;

    const postRef = doc(db, 'posts', id);

    const updatedData: Partial<Post> = {};

    if (hasTitleChanged) {
      updatedData.title = title;
    }

    if (hasImageChanged && file != null) {
      try {
        updatedData.image = await uploadImageToStorage(file); // 새 이미지를 업로드하고 URL을 가져오기
      } catch (error) {
        alert('이미지 업로드에 실패하였습니다.');
        console.error('Error uploading image:', error);
        return;
      }
    }

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

        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => {
            setContent(value);
            setHasContentChanged(true);
          }}
        />
      </form>

      <Footer />
    </Div>
  );
};

export default PostEdit;
