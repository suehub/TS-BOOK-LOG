import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import '../../assets/fonts/font.css';
import PostItem from './PostItem';
import { collection, getDocs, type Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const Div = styled.div`
  width: 90%;
  margin: 1rem auto;
`;

const PostWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

interface Post {
  id: string;
  title?: string;
  image?: string;
  content?: string;
  createdAt?: Timestamp;
  authorProfileImage?: string;
  authorName?: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async (): Promise<Post[]> => {
    const postsCollection = collection(db, 'posts');
    const postSnapshot = await getDocs(postsCollection);
    const postData: Post[] = postSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return postData;
  };

  useEffect(() => {
    void (async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    })();
  }, []);

  return (
    <Div>
      <div>menu</div>
      <PostWrapper>
        {posts.map((post, index) => {
          return <PostItem key={index} post={post} />;
        })}
      </PostWrapper>
    </Div>
  );
};

export default PostList;
