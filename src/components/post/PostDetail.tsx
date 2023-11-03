import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  type Timestamp,
  getDocs,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import defaultProfile from '../../assets/images/default_profile.png';
import { useAuth } from '../../context/Authcontext';
import { db } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { type Post } from '../home/PostList';
import Comments from './Comments';
import SideBar from './SideBar';

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
    font-size: 2.8rem;
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
        margin-right: 0.4rem;
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
        font-family: NotoSansKR-Regular;
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

  .content {
    font-family: NotoSans-Regular;
    line-height: 1.3;
    font-size: 1.1rem;
    h1 {
      font-size: 2.5rem;
    }
    h2 {
      font-size: 2rem;
    }
    h3 {
      font-size: 1.5rem;
    }
    strong {
      font-weight: 700;
    }
    em {
      font-style: italic;
    }
    u {
      text-decoration: underline;
    }
    ul {
      display: block;
      list-style-type: disc;
      margin: 1em 0;
      padding-left: 40px;
    }

    ol {
      display: block;
      list-style-type: decimal;
      margin: 1em 0;
      padding-left: 40px;
    }
    li {
      display: list-item;
    }
  }
`;

export const BookDesc = styled.a`
  margin: 3rem auto;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #f1f2f3;
  color: #000;

  div {
    width: 20%;
    height: auto;
    img {
      width: 80%;
      height: auto;
      padding: 0.2rem;
      object-fit: contain;
      border-radius: 2px;
      border-right: 1px solid #f1f2f3;
    }
  }

  .book-desc {
    width: 100%;
    font-family: NotoSansKR-Medium;
    p {
      font-size: 1.2rem;
      margin-bottom: 1.2rem;
    }

    span:last-of-type {
      font-family: NotoSansKR-Regular;
      font-size: 0.9rem;
      &::before {
        content: '|';
        padding: 0 0.8rem;
      }
    }
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

  const deletePostAndRelatedData = async (postId: string): Promise<void> => {
    const postRef = doc(collection(db, 'posts'), postId);

    // 관련 댓글 삭제
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    commentsSnapshot.forEach((doc) => {
      void deleteDoc(doc.ref);
    });

    // 관련 좋아요 삭제
    const likesQuery = query(
      collection(db, 'likes'),
      where('postId', '==', postId)
    );
    const likesSnapshot = await getDocs(likesQuery);
    likesSnapshot.forEach((doc) => {
      void deleteDoc(doc.ref);
    });

    // 관련 북마크 삭제
    const bookmarksQuery = query(
      collection(db, 'bookmarks'),
      where('postId', '==', postId)
    );
    const bookmarksSnapshot = await getDocs(bookmarksQuery);
    bookmarksSnapshot.forEach((doc) => {
      void deleteDoc(doc.ref);
    });

    // 포스트 삭제
    await deleteDoc(postRef);
  };

  // post 삭제
  const deletePost = async (): Promise<void> => {
    const userConfirmed = window.confirm('이 북로그를 삭제하시겠습니까?');

    if (!userConfirmed) return;
    if (id == null) return;

    try {
      await deletePostAndRelatedData(id);
      alert('북로그가 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      alert('북로그 삭제에 실패하였습니다.');
      console.error('Error deleting post and related data:', error);
    }
  };

  const formatBookDate = (
    dateString: string | undefined
  ): string | undefined => {
    if (dateString == null) {
      return undefined;
    }
    return dateString.replace(
      /^(\d{4})(\d{2})(\d{2})$/,
      (match, year, month, day) => `${year}-${month}-${day}`
    );
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

          <BookDesc
            className="book"
            href={post?.bookLink}
            target="_blank"
            rel="noreferrer"
          >
            <div>
              {post?.bookImage != null && (
                <img src={post?.bookImage} alt="content image" />
              )}
            </div>
            <div className="book-desc">
              <p>{post?.bookTitle}</p>
              <span>{post?.bookAuthor}</span>
              <span>{formatBookDate(post?.bookPubDate)}</span>
            </div>
          </BookDesc>

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
