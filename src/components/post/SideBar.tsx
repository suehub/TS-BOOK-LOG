import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  type CollectionReference,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import {
  BiBookmark,
  BiHeart,
  BiSolidBookmark,
  BiSolidHeart,
} from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../firebase';
import { useAuth } from '../../context/Authcontext';
import Swal from 'sweetalert2';

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
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { currentUser } = useAuth();

  // 데이터 패칭을 위한 함수 정의
  const fetchData = useCallback(
    async (
      id: string | undefined,
      ref: Query<DocumentData>,
      setState: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (id != null && userId != null) {
        const q = query(
          ref,
          where('userId', '==', userId),
          where('postId', '==', id)
        );
        const querySnapshot = await getDocs(q);
        setState(!querySnapshot.empty);
      }
    },
    [userId]
  );

  // 데이터 패칭을 위한 useEffect
  useEffect(() => {
    const likesRef = collection(db, 'likes');
    const bookmarksRef = collection(db, 'bookmarks');

    void fetchData(postId, likesRef, setIsLiked);
    void fetchData(postId, bookmarksRef, setIsBookmarked);

    // 좋아요 수 패칭
    if (postId != null) {
      const q = query(likesRef, where('postId', '==', postId));
      void getDocs(q).then((querySnapshot) => {
        setLikeCount(querySnapshot.size);
      });
    }
  }, [postId, userId, fetchData]);

  // 이벤트 핸들러 함수 정의
  const handleInteraction = async (
    action: boolean,
    ref: CollectionReference<DocumentData>,
    interactionState: boolean,
    updateState: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> => {
    const q = query(
      ref,
      where('userId', '==', userId),
      where('postId', '==', postId)
    );
    const querySnapshot = await getDocs(q);

    if (interactionState) {
      // 제거 로직
      for (const doc of querySnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      updateState(false);
    } else {
      // 추가 로직
      await addDoc(ref, { userId, postId, createdAt: new Date() });
      updateState(true);
    }
  };

  // 좋아요와 북마크 토글
  const handleLike = async (): Promise<void> => {
    if (currentUser == null) {
      void Swal.fire('좋아요', '로그인이 필요합니다.', 'error');
      return;
    }
    void handleInteraction(
      isLiked,
      collection(db, 'likes'),
      isLiked,
      setIsLiked
    );
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    navigate(`/post/${postId}`);
  };

  const handleBookmark = async (): Promise<void> => {
    if (currentUser == null) {
      void Swal.fire('북마크', '로그인이 필요합니다.', 'error');
      return;
    }
    void handleInteraction(
      isBookmarked,
      collection(db, 'bookmarks'),
      isBookmarked,
      setIsBookmarked
    );
  };

  return (
    <Div>
      <div
        onClick={() => {
          void handleLike();
        }}
        className="heart"
      >
        {isLiked ? <BiSolidHeart size={35} /> : <BiHeart size={35} />}
      </div>

      <span>{likeCount}</span>

      <div
        onClick={() => {
          void handleBookmark();
        }}
        className="bookmark"
      >
        {isBookmarked ? (
          <BiSolidBookmark size={35} />
        ) : (
          <BiBookmark size={35} />
        )}
      </div>
    </Div>
  );
};

export default SideBar;
