import { collection, doc, getDoc, type Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../firebase';
import Footer from '../common/Footer';
import Header from '../common/Header';
import defaultProfile from '../../assets/images/default_profile.png';
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
    font-size: 3rem;
    margin-bottom: 1.8rem;
    line-height: 1.2;
  }
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
    span:first-of-type {
      font-family: NotoSansKR-Medium;
      &::after {
        content: '⋅';
        padding: 0 0.4rem;
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
    // font-size: 1rem;
  }
`;

interface Post {
  id: string;
  title?: string;
  image?: string;
  content?: string;
  createdAt?: Timestamp;
  authorProfileImage?: string;
  authorName?: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>();

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

  return (
    <Wrapper>
      <Header />
      <SideBar />

      <Div>
        <div className="main">
          <p className="title">{post?.title}</p>
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

          <div className="content-image">
            {post?.image != null && (
              <img src={post?.image} alt="content image" />
            )}
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: post?.content ?? '' }}
          ></div>
        </div>
      </Div>
      <Footer />
    </Wrapper>
  );
};

export default PostDetail;
