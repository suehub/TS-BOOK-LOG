import { type Timestamp, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../firebase';
import PostItem from './PostItem';

export const Div = styled.div`
  width: 95%;
  margin: 1rem auto;
`;

export const PostWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

export interface Post {
  id?: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  authorId: string | undefined;
  authorProfileImage?: string;
  authorName?: string;
  likesCount: number;
  bookTitle: string;
  bookLink: string;
  bookImage: string;
  bookAuthor: string;
  bookPubDate: string;
}

const PostList: React.FC = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async (): Promise<Post[]> => {
    const postsCollection = collection(db, 'posts');
    const postSnapshot = await getDocs(postsCollection);
    const postData: Post[] = postSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Post),
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
