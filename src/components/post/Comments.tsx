import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  type DocumentData,
  type Timestamp,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import defaultProfile from '../../assets/images/default_profile.png';
import { useAuth } from '../../context/Authcontext';
import { db } from '../../firebase';

const Div = styled.div`
  width: 100%;
  margin: 3rem 0;
  border-top: 1px solid #e9ecef;
  padding: 2rem 0.2rem;
  > p {
    font-size: 1.1rem;
    line-height: 1.5;
    font-family: NotoSansKR-Medium;
    margin-bottom: 1rem;
  }
  .comments {
    margin-bottom: 2.5rem;
    > textarea {
      width: 100%;
      resize: none;
      padding: 1rem;
      outline: none;
      border: 1px solid #f1f3f5;
      margin-bottom: 1.5rem;
      border-radius: 4px;
      min-height: 6.125rem;
      font-size: 1rem;
      color: #212529;
      line-height: 1.75;
      background: #fff;
    }
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      > button {
        padding: 0.6rem 1.25rem;
        background: #000;
        color: #fff;
        cursor: pointer;
        border: none;
        border-radius: 6px;
        font-family: NotoSansKR-Medium;
        font-size: 1rem;
        &:hover {
          background-color: #262626;
        }
      }
    }
  }
`;

const Comment = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f1f3f5;
  .profile {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div:first-of-type {
      display: flex;
      align-items: center;
      img {
        width: 3rem;
        height: 3rem;
        display: block;
        border-radius: 50%;
        object-fit: cover;
      }
      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 1rem;
        p {
          &:first-of-type {
            font-family: NotoSansKR-Medium;
            font-size: 1.08rem;
            margin-bottom: 0.4rem;
          }
          &:last-of-type {
            font-family: NotoSansKR-Light;
            font-size: 0.8rem;
            color: #868e96;
          }
        }
      }
    }
    .button-wrapper {
      > button {
        font-size: 0.95rem;
        border: none;
        background: none;
        color: #868e96;
        &:first-of-type {
          margin-right: 0.8rem;
        }
        &:hover {
          color: #262626;
        }
      }
    }
  }
  .comment {
    padding: 0.2rem 0 0.2rem 0.5rem;
    font-family: NotoSansKR-Regular;
    font-size: 1.1rem;
    line-height: 1.7;
    letter-spacing: -0.004em;
    word-break: keep-all;
    overflow-wrap: break-word;
  }
  textarea {
    width: 100%;
    resize: none;
    padding: 1rem;
    outline: none;
    border: 1px solid #f1f3f5;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    min-height: 6.125rem;
    font-size: 1.1rem;
    color: #212529;
    line-height: 1.75;
    background: #fff;
  }
`;

interface CommentsProps {
  id: string;
}

const Comments: React.FC<CommentsProps> = ({ id }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<DocumentData[]>([]);
  const [commentText, setCommentText] = useState<string>('');

  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    if (id !== '') {
      void fetchComments(id).then((comments) => {
        setComments(comments);
      });
    }
    return () => {
      setComments([]);
    };
  }, [id]);

  const fetchComments = async (id: string): Promise<DocumentData[]> => {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', id)
    );
    try {
      const querySnapshot = await getDocs(commentsQuery);
      return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

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

  const addComment = async (
    postId: string,
    userId: string,
    commentText: string
  ): Promise<void> => {
    if (currentUser == null) {
      alert('로그인이 필요합니다.');
      return;
    }
    const commentCollection = collection(db, 'comments');
    try {
      await addDoc(commentCollection, {
        postId,
        authorId: userId,
        authorName: currentUser.displayName,
        authorImage: currentUser.photoURL,
        text: commentText,
        createdAt: new Date(),
      });
      alert('댓글이 성공적으로 추가되었습니다.');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 추가에 실패하였습니다.');
    }
  };

  // 댓글 추가
  const handleAddComment = async (): Promise<void> => {
    if (currentUser != null) {
      await addComment(id, currentUser.uid, commentText);
      const updatedComments = await fetchComments(id);
      setComments(updatedComments);
      setCommentText('');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string): Promise<void> => {
    const userConfirmed = window.confirm('댓글을 삭제하시겠습니까?');
    if (userConfirmed) {
      const commentRef = doc(db, 'comments', commentId);
      try {
        await deleteDoc(commentRef);
        alert('댓글이 삭제되었습니다.');
        const updatedComments = await fetchComments(id);
        setComments(updatedComments);
        navigate(`/post/${id}`);
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('댓글 삭제에 실패하였습니다.');
      }
    }
  };

  // 댓글 수정
  const updateComment = async (
    commentId: string,
    newText: string
  ): Promise<void> => {
    const commentRef = doc(db, 'comments', commentId);
    try {
      await updateDoc(commentRef, {
        text: newText,
        updatedAt: new Date(), // 수정된 시간도 업데이트
      });
      alert('댓글이 수정되었습니다.');
      setEditCommentId(null); // 수정 상태 초기화
      const updatedComments = await fetchComments(id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('댓글 수정에 실패하였습니다.');
    }
  };

  // 댓글 수정을 시작하는 함수
  const startEditing = (comment: DocumentData): void => {
    setEditCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  // 댓글 수정을 취소하는 함수
  const cancelEditing = async (): Promise<void> => {
    setEditCommentId(null);
    setEditCommentText('');
  };

  // 수정 완료 버튼을 눌렀을 때 호출되는 함수
  const handleUpdateComment = async (): Promise<void> => {
    if (editCommentId != null) {
      await updateComment(editCommentId, editCommentText);
      setEditCommentId(null); // 수정 상태 초기화
      setEditCommentText(''); // 텍스트 초기화
      const updatedComments = await fetchComments(id);
      setComments(updatedComments);
    }
  };

  // ...

  return (
    <Div>
      <p>{comments.length}개의 댓글</p>
      <div className="comments">
        <textarea
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
          placeholder="댓글을 작성하세요"
        />
        <div>
          <button
            onClick={() => {
              void handleAddComment();
            }}
            type="button"
          >
            댓글 작성
          </button>
        </div>
      </div>

      {comments.map((comment, idx) => (
        <Comment key={idx}>
          <div className="profile">
            <div>
              <img
                src={comment.authorImage ?? defaultProfile}
                alt="profile image"
              />
              <div className="info">
                <p>{comment.authorName}</p>
                <p>{formatDate(comment.createdAt)}</p>
              </div>
            </div>
            {currentUser != null && comment.authorId === currentUser.uid && (
              <div className="button-wrapper">
                {editCommentId === comment.id ? (
                  <>
                    <button
                      onClick={() => {
                        void handleUpdateComment();
                      }}
                      type="button"
                    >
                      수정 완료
                    </button>
                    <button
                      onClick={() => {
                        void cancelEditing();
                      }}
                      type="button"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        startEditing(comment);
                      }}
                      type="button"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => {
                        void handleDeleteComment(comment.id);
                      }}
                      type="button"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {editCommentId === comment.id ? (
            <textarea
              value={editCommentText}
              onChange={(e) => {
                setEditCommentText(e.target.value);
              }}
            />
          ) : (
            <div className="comment">{comment.text}</div>
          )}{' '}
        </Comment>
      ))}
    </Div>
  );
};

export default Comments;
