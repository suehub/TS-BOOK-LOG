import React from 'react';
import styled from 'styled-components';
import '../../assets/fonts/font.css';
import PostItem from './PostItem';

const Div = styled.div`
  width: 90%;
  margin: 1rem auto;
`;

const PostWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

const PostList: React.FC = () => {
  return (
    <Div>
      <div>menu</div>
      <PostWrapper>
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
      </PostWrapper>
    </Div>
  );
};

export default PostList;
