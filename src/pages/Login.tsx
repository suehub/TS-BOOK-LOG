import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../assets/fonts/font.css';
import LogoIcon from '../assets/images/logo.png';
import { useAuth } from '../context/Authcontext';

interface Props {
  color?: string;
  $background?: string;
}

export const Logo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 0.2rem;
  padding: 1.2rem 0;
  > img {
    width: 2.8rem;
    height: 2.9rem;
    margin-right: 0.3rem;
  }
  > p {
    padding-top: 0.5rem;
    font-family: NotoSansKR-SemiBold;
    font-size: 2rem;
  }
`;

const Div = styled.div`
  width: 28rem;
  margin: 6rem auto;
  > form {
    width: 100%;
    box-shadow: 0px 3px 6px #00000029;
    border: 2px solid #d2d2d2;
    border-radius: 5px;
    padding: 2rem;
    background-color: #fff;
    > div {
      width: 90%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      > input {
        width: 100%;
        margin-bottom: 2.4rem;
        padding: 0.2rem 0.1rem;
        border: none;
        border-bottom: 2px solid #b2b2b2;
        outline: none;
        font-family: NotoSansKR-Medium;
        font-size: 1.25rem;
        &::placeholder {
          color: #b2b2b2;
        }
      }
    }
    > span {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 0;
      white-space: nowrap;
      > hr {
        width: 11.2rem;
        height: 1px;
        size: 1.2px;
        background: #d2d2d2;
      }
    }
  }
`;

export const Button = styled.button<Props>`
  width: 100%;
  padding: 0.6rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-family: NotoSansKR-Bold;
  color: ${(props) => props.color ?? '#000'};
  background-color: ${(props) => props.$background ?? '#fff'};
  border: ${(props) =>
    props.$background === '#fff' ? '1px solid #d4d4d4' : 'none'};
  border-radius: 4px;
  transition: transform 0.8s;
  .google {
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.5rem;
  }
  &:hover {
    transform: scale(1.05);
    transition: transform 0.8s;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  margin-top: 1.3rem !important;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  > button {
    font-family: NotoSansKR-Medium;
    font-size: 1rem;
    border: none;
    background: none;
    cursor: pointer;
  }
  > span {
    margin: 0 1.8rem;
    color: #d2d2d2;
  }
  > a {
    font-family: NotoSansKR-Medium;
    color: #000;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const { login, googleLogin } = useAuth();

  // 로그인
  const handleLogin = async (): Promise<void> => {
    try {
      if (email !== undefined && password !== undefined) {
        await login(email, password);
        alert(`로그인되었습니다.`);
        navigate('/');
      }
    } catch (error) {
      alert('이메일 또는 패스워드가 잘못 입력되었습니다.');
      setPassword('');
      console.error('로그인 실패:', error);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await googleLogin();
      navigate('/');
    } catch (error) {
      alert('로그인에 실패하였습니다.');
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Div>
      <Logo
        onClick={() => {
          navigate('/');
        }}
      >
        <img src={LogoIcon} alt="logo" />
        <p>BOOKLOG</p>
      </Logo>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleLogin();
        }}
      >
        <div>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        <Button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          color="#087EA4"
          $background="#E6F7FF"
          type="submit"
        >
          로그인
        </Button>
        <span>
          <hr />
          &nbsp;&nbsp;&nbsp;또는 &nbsp;&nbsp;
          <hr />
        </span>
        <Button
          onClick={() => {
            void handleGoogleLogin();
          }}
          color="#000"
          $background="#fff"
          type="button"
        >
          <FcGoogle className="google" size={25} />
          Google 로그인
        </Button>
        <LinkWrapper>
          <button type="button">비밀번호 찾기</button>
          <span>|</span>
          <Link to="/signup">회원가입</Link>
        </LinkWrapper>
      </form>
    </Div>
  );
};

export default Login;
