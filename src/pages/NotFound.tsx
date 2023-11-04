import React from 'react';
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import { HomeDiv } from './Home';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Div = styled.div`
  margin-left: 2rem;
  p {
    margin-top: 4rem;
    margin-bottom: 2rem;
    font-family: NotoSansKR-Medium;
    font-size: 2rem;
  }
  button {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    border-radius: 6px;
    border: 3px solid #a5a5a5;
    background-color: inherit;
    span {
      padding-left: 0.8rem;
      font-family: NotoSansKR-Medium;
      font-size: 1.3rem;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <HomeDiv>
      <Header />
      <main>
        <Div>
          <p>존재하지 않는 페이지입니다</p>
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <BiArrowBack size={28} />
            <span>뒤로 가기</span>
          </button>
        </Div>
      </main>

      <Footer />
    </HomeDiv>
  );
};

export default NotFound;
