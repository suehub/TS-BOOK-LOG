import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LogoIcon from '../assets/icons/logo.png';
import { Button, Logo } from './Login';
import {
  type Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from 'firebase/auth';

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const Div = styled.div`
  width: 30rem;
  margin: 6rem auto;
  > form {
    width: 100%;
    box-shadow: 0px 3px 6px #00000029;
    border: 2px solid #d2d2d2;
    border-radius: 5px;
    padding: 2rem;
    > div {
      width: 90%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      > div {
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        > label {
          font-size: 1.25rem;
          font-family: NotoSansKR-Medium;
        }
        > input {
          width: 100%;
          margin-bottom: 1rem;
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
        > p {
          margin-bottom: 1rem;
          color: red;
        }
      }
    }
    > p {
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

export const Message = styled.span`
  font-family: NotoSansKR-Medium;
  font-size: 16px;
  padding-bottom: 1rem;
  color: red;
  left: 0;
  margin-top: -15px;
  margin-bottom: 8px;
  text-align: left;
`;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const authInstance = getAuth();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [isChanged, setIsChanged] = useState({
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
  });

  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setIsChanged({ ...isChanged, [id]: true });
  };

  const validateForm = (): boolean => {
    setIsValid(true);

    const newErrors = {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    };

    // 이메일 유효성 검사
    if (isChanged.email) {
      if (formData.email.trim() === '') {
        newErrors.email = '이메일을 입력하세요.';
        setIsValid(false);
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다.';
        setIsValid(false);
      }
    }

    // 이름 유효성 검사
    if (isChanged.name) {
      if (formData.name.trim() === '') {
        newErrors.name = '닉네임을 입력하세요.';
        setIsValid(false);
      } else if (formData.name.length < 2 || formData.name.length > 20) {
        newErrors.name = '닉네임은 2자에서 20자 사이어야 합니다.';
        setIsValid(false);
      } else if (!/^[a-zA-Z0-9가-힣]+$/.test(formData.name)) {
        newErrors.name = '특수 문자를 포함할 수 없는 닉네임입니다.';
        setIsValid(false);
      }
    }

    // 비밀번호 유효성 검사
    if (isChanged.password) {
      if (formData.password.trim() === '') {
        newErrors.password = '비밀번호를 입력하세요.';
        setIsValid(false);
      } else if (formData.password.length < 6) {
        newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
        setIsValid(false);
      }
    }

    // 비밀번호 일치 검사
    if (isChanged.confirmPassword) {
      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        setIsValid(false);
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // 회원가입
  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>,
    authInstance: Auth
  ): Promise<void> => {
    e.preventDefault();
    if (isValid) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          authInstance,
          formData.email,
          formData.password
        );

        const { user } = userCredential;

        if (user != null) {
          await updateProfile(user, {
            displayName: formData.name !== '' ? formData.name : null,
          });

          alert(`${user.displayName} 님, 환영합니다`);
          navigate('/');
        }
      } catch (error) {
        const EMAIL_DUPLICATE_ERROR_CODE = 'auth/email-already-in-use';

        if (typeof error === 'object' && error !== null && 'code' in error) {
          const errorCode = error.code;

          if (errorCode === EMAIL_DUPLICATE_ERROR_CODE) {
            alert('중복된 이메일이 존재합니다.');
          }
        }
      }
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
          void handleSignup(e, authInstance);
        }}
      >
        <div>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              value={formData.email}
              onChange={handleInputChange}
              id="email"
              type="email"
            />
            <p>{errors.email}</p>
          </div>
          <div>
            <label htmlFor="name">닉네임</label>
            <input
              value={formData.name}
              onChange={handleInputChange}
              id="name"
              type="text"
            />
            <p>{errors.name}</p>
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              type="password"
            />
            <p>{errors.password}</p>
          </div>
          <div>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              value={formData.confirmPassword}
              onChange={handleInputChange}
              id="confirmPassword"
              type="password"
            />
            <p>{errors.confirmPassword}</p>
          </div>
          <Button color="#087ea4" $background="#e6f7ff" type="submit">
            회원가입
          </Button>
        </div>
      </form>
    </Div>
  );
};

export default Signup;
