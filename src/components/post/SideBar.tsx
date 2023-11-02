import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BiSolidHeart,
  BiHeart,
  BiBookmark,
  BiSolidBookmark,
} from 'react-icons/bi';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Div = styled.div`
  width: 4.3rem;
  padding: 0.5rem 1.2rem;
  position: fixed;
  top: 11rem;
  left: calc(50% - 40rem + 2.5rem);
  transition: position 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2rem;
  background-color: #f8f9fa;
  border: 1px solid #f1f3f5;
  .heart,
  .bookmark {
    display: flex;
    align-items: center;
    padding: 0.6rem;
    border-radius: 50%;
    border: 1px solid #f1f3f5;
    background-color: #fff;
    cursor: pointer;
  }
  span {
    margin: 0.5rem 0 1rem 0;
    font-family: NotoSansKR-Medium;
  }
`;

interface SideBarProps {
  postId: string | undefined;
  userId: string | undefined;
}

const SideBar: React.FC<SideBarProps> = ({ postId, userId }) => {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const checkLike = async (): Promise<void> => {
      const liked = await isLikedByUser();
      setIsLiked(liked);
    };

    const fetchLikeCount = async (): Promise<void> => {
      const likesRef = collection(db, 'likes');
      const q = query(likesRef, where('postId', '==', postId));
      const querySnapshot = await getDocs(q);
      setLikeCount(querySnapshot.size);
    };

    if (postId != null) {
      void checkLike();
      void fetchLikeCount();
    }

    const checkBookmark = async (): Promise<void> => {
      const bookmarked = await isBookmarkedByUser();
      setIsBookmarked(bookmarked);
    };

    if (userId != null && postId != null) {
      void checkBookmark();
    }
  }, [postId, userId]);

  // 좋아요 추가
  const addLike = async (): Promise<void> => {
    try {
      const postRef = doc(collection(db, 'posts'), postId);
      const newLike = {
        userId,
        postId,
        createdAt: new Date(),
      };

      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);

        if (!postDoc.exists()) {
          throw Error('Post does not exist!');
        }

        transaction.update(postRef, {
          likesCount: postDoc.data().likesCount + 1,
        });
        const likesRef = collection(db, 'likes');
        await addDoc(likesRef, newLike);
      });

      setIsLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('Failed to add like:', error);
    }
  };

  // 좋아요 취소
  const removeLike = async (): Promise<void> => {
    try {
      const postRef = doc(collection(db, 'posts'), postId);

      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);

        if (!postDoc.exists()) {
          throw Error('Post does not exist!');
        }

        transaction.update(postRef, {
          likesCount: postDoc.data().likesCount - 1,
        });

        const likesRef = collection(db, 'likes');
        const q = query(
          likesRef,
          where('userId', '==', userId),
          where('postId', '==', postId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          void deleteDoc(doc.ref);
        });
      });

      setIsLiked(false);
      setLikeCount((prevCount) => prevCount - 1);
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('Failed to remove like:', error);
    }
  };

  // 사용자가 게시물에 좋아요를 눌렀는지 확인
  const isLikedByUser = async (): Promise<boolean> => {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('userId', '==', userId),
      where('postId', '==', postId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const isBookmarkedByUser = async (): Promise<boolean> => {
    const bookmarksRef = collection(db, 'bookmarks');
    const q = query(
      bookmarksRef,
      where('userId', '==', userId),
      where('postId', '==', postId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const addBookmark = async (): Promise<void> => {
    const bookmarksRef = collection(db, 'bookmarks');
    await addDoc(bookmarksRef, {
      userId,
      postId,
      createdAt: new Date(),
    });
    setIsBookmarked(true);
  };

  const removeBookmark = async (): Promise<void> => {
    const bookmarksRef = collection(db, 'bookmarks');
    const q = query(
      bookmarksRef,
      where('userId', '==', userId),
      where('postId', '==', postId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      void deleteDoc(doc.ref);
    });
    setIsBookmarked(false);
  };

  return (
    <Div>
      {isLiked ? (
        <div
          onClick={() => {
            void removeLike();
          }}
          className="heart"
        >
          <BiSolidHeart size={35} />
        </div>
      ) : (
        <div
          onClick={() => {
            void addLike();
          }}
          className="heart"
        >
          <BiHeart size={35} />
        </div>
      )}

      <span>{likeCount}</span>
      {isBookmarked ? (
        <div
          onClick={() => {
            void removeBookmark();
          }}
          className="bookmark"
        >
          <BiSolidBookmark size={35} />
        </div>
      ) : (
        <div
          onClick={() => {
            void addBookmark();
          }}
          className="bookmark"
        >
          <BiBookmark size={35} />
        </div>
      )}
    </Div>
  );
};

export default SideBar;
