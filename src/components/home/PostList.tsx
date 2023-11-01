import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../firebase';
import PostItem from './PostItem';
import { type Post } from '../post/PostDetail';

const Div = styled.div`
  width: 95%;
  margin: 1rem auto;
`;

const PostWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

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
