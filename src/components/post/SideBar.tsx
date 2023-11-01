import React from 'react';
import styled from 'styled-components';
import { CiHeart, CiBookmark } from 'react-icons/ci';

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

const SideBar: React.FC = () => {
  return (
    <Div>
      <div className="heart">
        <CiHeart size={35} />
      </div>
      <span>28</span>
      <div className="bookmark">
        <CiBookmark size={35} />
      </div>
    </Div>
  );
};

export default SideBar;
