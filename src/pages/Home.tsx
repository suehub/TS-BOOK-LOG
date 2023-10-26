import React from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Div = styled.div`
  height: 100%;
`;

const Home: React.FC = () => {
  return (
    <Div>
      <Header />
      <div>home</div>
      <Footer />
    </Div>
  );
};

export default Home;
