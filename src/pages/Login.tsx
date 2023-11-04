import React, { useRef, useState } from 'react';
import { BiBookReader } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
  > p {
    margin-left: 0.3rem;
    padding-bottom: 0.1rem;
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

const ModalBackground = styled.div<Props>`
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
  > div {
    width: 30vw;
    height: 35vh;
    min-height: 45%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: 20px;
    z-index: 99;
    font-family: NotoSansKR-Medium;
    > form {
      width: 100%;
      height: 100%;
      padding: 1rem 2.7rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div:first-of-type {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .title {
    width: 100%;
    border-bottom: 1px solid #d2d2d2;
    text-align: left;
    > div {
      padding: 1.5rem 2.7rem;
      font-family: NotoSansKR-Bold;
      font-size: 1.2rem;
    }
  }
  .find-label {
    margin: 1rem 0px;
    font-family: NotoSansKR-Medium;
    font-size: 1rem;
    color: #000;
    &::after {
      content: '*';
      color: rgb(240, 61, 12);
      margin-left: 0.4rem;
    }
  }
  .find-input {
    width: 100%;
    height: 100%;
    font-family: NotoSansKR-Medium;
    font-size: 1rem;
    padding: 1rem;
    padding-left: 0.8rem;
    outline: none;
    border-radius: 8px;
    border: 1.8px solid #d2d2d2;
  }
  .find-button__wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }
`;

const FindButton = styled(Button)`
  width: 80vw;
  &:first-of-type {
    margin-right: 2rem;
  }
  font-size: 1.2rem;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [findEmail, setFindEmail] = useState<string>('');

  const [isModal, setIsModal] = useState<boolean>(false);
  const modalBackgroundRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { login, googleLogin, resetPassword } = useAuth();

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

  // 비밀번호 재설정
  const handleFindPassword = async (): Promise<void> => {
    try {
      if (findEmail.trim() !== '') {
        await resetPassword(findEmail);
        alert('메일 전송에 성공했습니다.');
        setFindEmail('');
        setIsModal(false);
      }
    } catch (error) {
      alert('메일 전송에 실패했습니다.');
      console.error('메일 전송 실패:', error);
      setFindEmail('');
    }
  };

  const handleClickBackground = async (
    e: React.MouseEvent<HTMLDivElement>
  ): Promise<void> => {
    if (e.target === modalBackgroundRef.current) {
      setIsModal(false);
      setFindEmail('');
    }
  };

  return (
    <>
      <Div>
        <Logo
          onClick={() => {
            navigate('/');
          }}
        >
          <BiBookReader size={40} />
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
          <Button color="#087EA4" $background="#E6F7FF" type="submit">
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
            <button
              onClick={() => {
                setEmail('');
                setIsModal(true);
              }}
              type="button"
            >
              비밀번호 찾기
            </button>
            <span>|</span>
            <Link to="/signup">회원가입</Link>
          </LinkWrapper>
        </form>
      </Div>

      {isModal && (
        <ModalBackground
          onClick={(e) => {
            void handleClickBackground(e);
          }}
          ref={modalBackgroundRef}
        >
          <div>
            <div className="title">
              <div>비밀번호 찾기</div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleFindPassword();
              }}
            >
              <div>
                <label className="find-label" htmlFor="email">
                  이메일
                </label>
                <input
                  className="find-input"
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={findEmail}
                  onChange={(e) => {
                    setFindEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="find-button__wrapper">
                <FindButton
                  color="#808080"
                  $background="#fff"
                  type="button"
                  onClick={() => {
                    setIsModal(false);
                  }}
                >
                  Cancel
                </FindButton>
                <FindButton color="#087EA4" $background="#E6F7FF" type="submit">
                  Send
                </FindButton>
              </div>
            </form>
          </div>
        </ModalBackground>
      )}
    </>
  );
};

export default Login;
