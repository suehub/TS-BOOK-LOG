import React from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { SiVelog } from 'react-icons/si';
import styled from 'styled-components';
import '../../assets/fonts/font.css';
import LogoIcon from '../../assets/images/logo.png';

const Div = styled.div`
  width: 100%;
  padding: 0.9rem 1rem 1.3rem 2.8rem;
  display: flex;
  align-items: center;
  position: relative;
  bottom: 0;
  border-top: 1px solid #a5a5a5;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  > img {
    width: 1.3rem;
    height: 1.4rem;
    margin-right: 0.3rem;
    margin-bottom: 0.5rem;
  }
  > p {
    font-size: 0.8rem;
  }
  > span {
    margin: 0 0.4rem;
  }
`;

const Contact = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  > a {
    display: flex;
    align-items: center;
    color: black;
    .icon {
      margin: 0 0.5rem 0.2rem 0;
    }
  }
  > span {
    margin-left: 0.4rem;
    margin-right: 0.2rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <Div>
      <Logo>
        <img src={LogoIcon} alt="logo" />
        <p>BOOKLOG</p>
        <span>|</span>
      </Logo>

      <Contact>
        <a
          href="https://github.com/suehub/TS-BOOK-LOG"
          target="_blank"
          rel="noreferrer"
        >
          <AiFillGithub className="icon" size={20} />
        </a>
        <a href="https://velog.io/@suehub" target="_blank" rel="noreferrer">
          <SiVelog className="icon" size={20} />
        </a>
        <span>|</span>
        <span>Copyright 2023 All ⓒ rights reserved</span>
      </Contact>
    </Div>
  );
};

export default Footer;
