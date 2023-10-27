import React from 'react';
import styled from 'styled-components';
import LogoIcon from '../../assets/icons/logo.png';
import SearchIcon from '../../assets/icons/search-icon.png';
import LoginIcon from '../../assets/icons/login-icon.png';
import LogoutIcon from '../../assets/icons/logout-icon.png';
import PostIcon from '../../assets/icons/post-icon.png';
import '../../assets/fonts/font.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';

const Div = styled.header`
  width: 100%;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  border-bottom: 1px solid #000;
  object-fit: cover;
  * {
    font-family: NotoSansKR-Medium;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 0.2rem;
  padding: 0.2rem;
  > img {
    width: 2.5rem;
    height: 2.6rem;
    margin-right: 0.3rem;
  }
  > p {
    padding-top: 0.2rem;
    font-size: 1.6rem;
  }
`;

const Search = styled.div`
  height: 95%;
  display: flex;
  align-items: center;
  border: 2px solid #000;
  border-radius: 50px;
  > img {
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 0.8rem;
  }
  > input {
    width: 90%;
    margin: 0 0.3rem;
    border: none;
    font-size: 1rem;
    &:focus {
      outline: none;
    }
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin-right: 2rem;
  cursor: pointer;
  color: #000;
  a {
    color: #000;
    padding-bottom: 0.3rem;
  }
  img {
    width: 1.4rem;
    height: 1.4rem;
    margin-right: 0.5rem;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // 현재 사용자 정보 가져오기
  const userName = currentUser?.displayName;

  const handleLogout = async (): Promise<void> => {
    console.log('로그아웃 시도');
    try {
      if (confirm('로그아웃하시겠습니까?')) {
        await logout(); // 로그아웃 함수 호출
        alert('로그아웃되었습니다.');
        navigate('/');
      }
    } catch (error) {
      alert('로그아웃에 실패하였습니다. 다시 시도해주세요');
      console.error('로그아웃 실패:', error);
    }
  };

  console.log(userName);
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
      <Search>
        <img src={SearchIcon} alt="search icon" />
        <input type="text" />
      </Search>
      <Nav>
        <NavItem>
          <Link to="">
            <img src={PostIcon} alt="post icon" />
            <span>BookLog</span>
          </Link>
        </NavItem>
        {currentUser === null ? (
          <NavItem>
            <Link
              to="/login"
              onClick={() => {
                navigate('/login');
              }}
            >
              <img src={LoginIcon} alt="login icon" />
              <span>Login</span>
            </Link>
          </NavItem>
        ) : (
          <>
            <div>nicknam님</div>
            <NavItem
              onClick={() => {
                void handleLogout();
              }}
            >
              <img src={LogoutIcon} alt="logout icon" />
              <span>Logout</span>
            </NavItem>
          </>
        )}
      </Nav>
    </Div>
  );
};

export default Header;
