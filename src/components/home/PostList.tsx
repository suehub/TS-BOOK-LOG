import React from 'react';
import styled from 'styled-components';
import LogoImg from '../../assets/images/logo.png';
import { AiOutlineHeart } from 'react-icons/ai';
import '../../assets/fonts/font.css';

const Div = styled.div`
  width: 90%;
  margin: 1rem auto;
`;

const PostWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

const PostItem = styled.div`
  width: 20vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: #fff;
  border-radius: 4px;
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
    height: 10rem;
    object-fit: cover;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  > div {
    width: 90%;
    margin: 0 auto;
  }
  .title {
    width: inherit;
    font-size: 1.05rem;
    font-family: NotoSansKR-Medium;
    margin: 0.8rem 0 0.6rem 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .content {
    width: inherit;
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
          width: 1.3rem;
          height: 1.3rem;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 0.3rem;
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

const PostList: React.FC = () => {
  return (
    <Div>
      <div>menu</div>
      <PostWrapper>
        <PostItem>
          <img
            src="https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791167372864.jpg"
            alt="book image"
          />
          <div>
            <div>
              <p className="title">
                제목이 길어지면 어디까지 보이는지 테스트하기 위해 길게 작성하는
                제목입니다요.
              </p>
              <p className="content">
                내용이 길어지면 어디까지 보이는지 테스트하기 위해 길게 작성하는
                글입니다요. 내용이 길어지면 어디까지 보이는지 테스트하기 위해
                길게 작성하는 글입니다요.
              </p>
              <div className="desc">
                <span>2023-10-29</span>
                <span>2개의 댓글</span>
              </div>
            </div>
          </div>
          <div className="profile">
            <div>
              <div>
                <img
                  className="profile-image"
                  src={LogoImg}
                  alt="profile image"
                />
                <span className="text">by</span>
                <span> nickname</span>
              </div>

              <div className="heart">
                <AiOutlineHeart className="heart-icon" size={12} />
                <span>12</span>
              </div>
            </div>
          </div>
        </PostItem>
      </PostWrapper>
    </Div>
  );
};

export default PostList;
