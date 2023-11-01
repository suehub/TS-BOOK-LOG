import React from 'react';
import styled from 'styled-components';
import { AiOutlineHeart } from 'react-icons/ai';
import { type Timestamp } from 'firebase/firestore';
import defaultImage from '../../assets/images/default_image.png';

const Div = styled.div`
  width: 20vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.04);
  transition:
    box-shadow 0.25s ease-in,
    transform 0.25s ease-in;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.08);
  }
  > img {
    width: 100%;
    height: 15rem;
    object-fit: cover;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .default-image {
    object-fit: contain;
  }
  > div {
    width: 90%;
    margin: 0 auto;
  }
  .title {
    width: inherit;
    font-size: 1.05rem;
    font-family: NotoSansKR-Medium;
    margin: 1rem 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .content {
    width: inherit;
    height: 2.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.01rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: NotoSansKR-Light;
    font-size: 0.9rem;
  }
  .desc {
    font-family: NotoSansKR-Light;
    font-size: 0.8rem;
    color: #a5a5a5;
    & > span:first-of-type::after {
      content: '⋅';
      margin: 0 0.2rem;
    }
  }
  .profile {
    width: 100%;
    margin: 1.2rem auto 1rem auto;
    padding-top: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f3f5;
    font-size: 0.8rem;
    > div {
      width: 90%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      & > div {
        display: flex;
        align-items: center;
        .profile-image {
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 0.5rem;
        }
        & > span {
          font-family: NotoSansKR-SemiBold;
          white-space: nowrap;
        }
        .text {
          font-family: NotoSansKR-Light;
          margin-right: 0.2rem;
        }
      }
      .heart {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        margin-left: auto;
        .heart-icon {
          margin-right: 0.2rem;
        }
        > span {
          font-family: NotoSansKR-Light;
        }
      }
    }
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

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const formatDate = (timestamp?: Timestamp): string => {
    if (timestamp == null) return ''; // createdAt이 없을 경우 빈 문자열 반환

    const dateObj = timestamp.toDate();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const stripHtml = (html: string | undefined): string => {
    if (html == null) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent ?? '';
  };

  return (
    <Div>
      {post.image != null ? (
        <img src={post.image} alt="book image" />
      ) : (
        <img className="default-image" src={defaultImage} alt="book image" />
      )}
      <div>
        <div>
          <p className="title">{post.title}</p>
          <p className="content">
            {post.content != null ? stripHtml(post.content) : ''}
          </p>
          <div className="desc">
            <span>{formatDate(post.createdAt)}</span>
            <span>2개의 댓글</span>
          </div>
        </div>
      </div>
      <div className="profile">
        <div>
          <div>
            <img
              className="profile-image"
              src={post.authorProfileImage}
              alt="profile image"
            />
            <span className="text">by</span>
            <span> {post.authorName}</span>
          </div>

          <div className="heart">
            <AiOutlineHeart className="heart-icon" size={12} />
            <span>12</span>
          </div>
        </div>
      </div>
    </Div>
  );
};

export default PostItem;
