import React from 'react';
import '../../assets/fonts/font.css';
import styled from 'styled-components';
import LogoIcon from '../../assets/icons/logo.png';

const Div = styled.div`
  width: 100%;
  padding: 0.9rem 1rem 1.3rem 2.8rem;
  display: flex;
  align-items: center;
  position: relative;
  bottom: 0;
  border-top: 1px solid #a5a5a5;
  background-color: #fff;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  > img {
    width: 1.3rem;
    height: 1.4rem;
    margin-right: 0.3rem;
    margin-bottom: 0.5rem;
  }
  > p {
    font-size: 0.8rem;
  }
`;

const Contact = styled.div`
  display: flex;
  font-size: 0.8rem;
  > a {
    color: black;
  }
  > span {
    margin: 0 0.2rem 0 0.6rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <Div>
      <Logo>
        <img src={LogoIcon} alt="logo" />
        <p>BOOKLOG</p>
      </Logo>
      <Contact>
        <a
          href="https://github.com/suehub/TS-BOOK-LOG"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        <span>|</span>
        <span>Copyright 2023 All ⓒ rights reserved</span>
      </Contact>
    </Div>
  );
};

export default Footer;
