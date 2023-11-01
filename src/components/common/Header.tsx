import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiLogIn, BiLogOut } from 'react-icons/bi';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../../assets/fonts/font.css';
import LogoIcon from '../../assets/images/logo.png';
import { useAuth } from '../../context/Authcontext';

const Div = styled.header`
  width: 95%;
  margin: 0 auto;
  padding: 1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  // border-bottom: 1px solid #a5a5a5;
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
  .search {
    margin-left: 0.8rem;
  }
  > input {
    background-color: inherit;
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
  white-space: nowrap;
  cursor: pointer;
  color: #000;
  border-radius: 2rem;
  &:not(:last-of-type) {
    margin-right: 1.5rem;
    > a {
      border-radius: 20px;
      padding: 0.5rem 1rem;

      &:hover {
        color: #fff;
        background-color: #000;
      }
    }
  }
  a {
    display: flex;
    align-items: center;
    color: #000;
    > span {
      margin: 0 0.2rem;
    }
  }
  .logout {
    padding: 0.8rem 1rem;
    position: absolute;
    top: 3.5rem;
    right: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000029;
    z-index: 99;
    border-radius: 5px;
    font-size: 1rem;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // 현재 사용자 정보 가져오기
  const userName = currentUser?.displayName;
  const [isDrop, setIsDrop] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickEvent = (e: MouseEvent): void => {
      if (
        dropdownRef.current != null &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDrop(false); // 항상 false로 설정하여 드롭다운을 닫습니다.
      }
    };
    if (isDrop) {
      window.addEventListener('click', clickEvent);
    }

    return () => {
      window.removeEventListener('click', clickEvent);
    };
  }, [isDrop]);

  // 로그아웃
  const handleAsyncLogout = async (): Promise<void> => {
    try {
      if (confirm('로그아웃하시겠습니까?')) {
        await logout();
        alert('로그아웃되었습니다.');
        navigate('/');
      }
    } catch (error) {
      alert('로그아웃에 실패하였습니다. 다시 시도해주세요');
      console.error('로그아웃 실패:', error);
    }
  };

  const handleLogout = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.stopPropagation();
    void handleAsyncLogout();
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
      <Search>
        <AiOutlineSearch className="search" size={26} />
        <input type="text" />
      </Search>
      <Nav>
        {currentUser != null ? (
          <>
            <NavItem className="write">
              <Link to="/write">
                <HiOutlinePencilSquare size={25} />
                <span>BookLog</span>
              </Link>
            </NavItem>
            <NavItem className="profile">
              <div
                ref={dropdownRef}
                onClick={() => {
                  setIsDrop(!isDrop);
                }}
              >
                <a>
                  <span>{userName} 님</span>
                  <IoMdArrowDropdown size={25} />
                </a>
                {isDrop && (
                  <NavItem className="logout" onClick={handleLogout}>
                    <a>
                      <BiLogOut size={20} />
                      <span>Logout</span>
                    </a>
                  </NavItem>
                )}
              </div>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <Link to="/login">
              <BiLogIn size={25} />
              <span>Login</span>
            </Link>
          </NavItem>
        )}
      </Nav>
    </Div>
  );
};

export default Header;
