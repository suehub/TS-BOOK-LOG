import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  type Timestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import defaultProfile from '../../assets/images/default_profile.png';
import { useAuth } from '../../context/Authcontext';
import { db } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';
import SideBar from './SideBar';
import Comments from './Comments';
import { type Post } from '../home/PostList';

const Wrapper = styled.div`
  background-color: #fff;
`;

const Div = styled.div`
  width: 50%;
  margin: 4rem auto;
  .main {
    width: 100%;
  }
  .title {
    font-family: NotoSansKR-Bold;
    font-size: 3rem;
    margin-bottom: 1.8rem;
    line-height: 1.2;
  }
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .desc {
      display: flex;
      align-items: center;
      font-family: NotoSansKR-Regular;
      font-size: 1.05rem;
      margin-bottom: 1rem;
      padding-left: 0.2rem;
      > img {
        width: 1.42rem;
        height: 1.42rem;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 0.3rem;
      }
      span {
        line-height: 0.9;
      }
      span:first-of-type {
        font-family: NotoSansKR-Medium;
        &::after {
          content: '⋅';
          padding: 0 0.3rem;
        }
      }
      span:last-of-type {
        font-family: NotoSansKR-Light;
      }
    }
    .button-wrapper {
      > button {
        background-color: #fff;
        border: none;
        font-size: 1.1rem;
        padding-left: 1rem;
        color: darkgray;
        &:hover {
          color: #000;
        }
      }
    }
  }

  .content-image {
    max-width: 100%;
    margin: 3rem auto;
    width: 60%;
    height: auto;
    > img {
      width: 100%;
      height: auto;
      object-fit: contain;
    }
  }
  .content {
    line-height: 1.3;
  }
`;

const PostDetail: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [post, setPost] = useState<Post | null>();

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      const postRef = doc(collection(db, 'posts'), id);

      try {
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          setPost({
            ...(postDoc.data() as Post),
          });
        } else {
          console.error('No such post found!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    void fetchPost();
    return () => {
      setPost(null);
    };
  }, [id]);

  const formatDate = (timestamp?: Timestamp): string => {
    if (timestamp == null) return '';

    const dateObj = timestamp.toDate();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // post 삭제
  const deletePost = async (): Promise<void> => {
    const userConfirmed = window.confirm('이 북로그를 삭제하시겠습니까?');

    if (!userConfirmed) return;

    try {
      const postRef = doc(collection(db, 'posts'), id);
      await deleteDoc(postRef);
      alert('북로그가 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      alert('북로그 삭제에 실패하였습니다.');
    }
  };

  return (
    <Wrapper>
      <Header />
      <SideBar postId={id} userId={currentUser?.uid} />

      <Div>
        <div className="main">
          <p className="title">{post?.title}</p>
          <div className="info">
            <div className="desc">
              <img
                src={
                  post?.authorProfileImage !== ''
                    ? post?.authorProfileImage
                    : defaultProfile
                }
                alt="profile image"
              />
              <span>{post?.authorName}</span>
              <span>{formatDate(post?.createdAt)}</span>
            </div>
            {currentUser?.uid === post?.authorId && (
              <div className="button-wrapper">
                <button
                  onClick={() => {
                    navigate(`/edit/${id}`);
                  }}
                  type="button"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void deletePost();
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <div className="content-image">
            {post?.bookImage != null && (
              <img src={post?.bookImage} alt="content image" />
            )}
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: post?.content ?? '' }}
          ></div>
        </div>

        {id != null && <Comments id={id} />}
      </Div>
      <Footer />
    </Wrapper>
  );
};

export default PostDetail;
