import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiBookReader, BiBookmark, BiLogIn, BiLogOut } from 'react-icons/bi';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../../assets/fonts/font.css';
import { useAuth } from '../../context/Authcontext';

const Div = styled.header`
  width: 95%;
  margin: 0 auto;
  padding: 1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
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
  padding: 0 0.2rem;
  > p {
    margin-left: 0.25rem;
    font-size: 1.6rem;
  }
`;

const Search = styled.form`
  display: flex;
  align-items: center;
  border: 2px solid #000;
  border-radius: 20rem;
  .search {
    margin-left: 1rem;
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
  .search-button {
    padding: 0.6rem 1rem;
    white-space: nowrap;
    font-size: 1.1rem;
    border-top-right-radius: 20rem;
    border-bottom-right-radius: 20rem;
    border: none;
    border-left: 2px solid #000;
    background-color: #f1f2f3;
    &:hover {
      background-color: rgb(0, 0, 0, 0.08);
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
    margin-right: 1.2rem;
    > a {
      border-radius: 2rem;
      padding: 0.7rem 1rem;

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
    position: absolute;
    top: 4rem;
    right: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000029;
    z-index: 99;
    border-radius: 5px;
    font-size: 1rem;
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.8rem 1rem;
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
      &:first-of-type {
        border-bottom: 2px solid #f1f3f5;
      }
      > span {
        padding: 0 0.2rem;
      }
    }
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth(); // 현재 사용자 정보 가져오기
  const userName = currentUser?.displayName;

  const [isDrop, setIsDrop] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };
  useEffect(() => {
    const clickEvent = (e: MouseEvent): void => {
      if (
        dropdownRef.current != null &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDrop(false);
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

  const handleLogout = (e: React.MouseEvent<HTMLDivElement>): void => {
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
        <BiBookReader size={35} />
        <p>BOOKLOG</p>
      </Logo>
      <Search
        onSubmit={(e) => {
          void handleSearch(e);
        }}
      >
        <AiOutlineSearch className="search" size={26} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <button className="search-button" type="submit">
          검색
        </button>
      </Search>
      <Nav>
        {currentUser != null ? (
          <>
            <NavItem className="write">
              <Link to="/write">
                <HiOutlinePencilSquare size={25} />
                <span>새 글 작성</span>
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
                  <NavItem className="logout">
                    <div
                      onClick={() => {
                        navigate('/bookmarks');
                      }}
                    >
                      <BiBookmark size={20} />
                      <span>북마크</span>
                    </div>
                    <div onClick={handleLogout}>
                      <BiLogOut size={20} />
                      <span>로그아웃</span>
                    </div>
                  </NavItem>
                )}
              </div>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <Link to="/login">
              <BiLogIn size={25} />
              <span>로그인</span>
            </Link>
          </NavItem>
        )}
      </Nav>
    </Div>
  );
};

export default Header;
