import React from 'react';
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import PostList from '../components/home/PostList';
// import Slick from '../components/home/Slick';

const Div = styled.div`
  > main {
    width: 95%;
    margin: 0 auto;
  }
`;

const Home: React.FC = () => {
  return (
    <Div>
      <Header />
      <main>
        {/* <Slick /> */}
        <PostList />
      </main>

      <Footer />
    </Div>
  );
};

export default Home;
