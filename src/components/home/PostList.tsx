import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PostItem from './PostItem';
import { collection, getDocs, type Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Div = styled.div`
  width: 95%;
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
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async (): Promise<Post[]> => {
    const postsCollection = collection(db, 'posts');
    const postSnapshot = await getDocs(postsCollection);
    const postData: Post[] = postSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    postData.sort(
      (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
    );

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
          return (
            <div
              key={index}
              onClick={() => {
                navigate(`/post/${post.id}`);
              }}
            >
              <PostItem post={post} />
            </div>
          );
        })}
      </PostWrapper>
    </Div>
  );
};

export default PostList;
