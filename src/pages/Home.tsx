import React from 'react';
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import PostList from '../components/home/PostList';

export const HomeDiv = styled.div`
  background-color: #f8f9fa;
  > main {
    width: 95%;
    min-height: 80vh;
    margin: 0 auto;
  }
`;

const Home: React.FC = () => {
  return (
    <HomeDiv>
      <Header />
      <main>
        <PostList />
      </main>

      <Footer />
    </HomeDiv>
  );
};

export default Home;
