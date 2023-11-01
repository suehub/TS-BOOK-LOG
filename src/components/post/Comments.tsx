import React from 'react';
import styled from 'styled-components';

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
      color: ##212529;
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

const Comments: React.FC = () => {
  return (
    <Div>
      <p>0개의 댓글</p>
      <div className="comments">
        <textarea placeholder="댓글을 작성하세요"></textarea>
        <div>
          <button type="button">댓글 작성</button>
        </div>
      </div>
    </Div>
  );
};

export default Comments;
