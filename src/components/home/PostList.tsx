import { collection, getDocs, type Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../firebase';
import PostItem from './PostItem';

export const Div = styled.div`
  width: 95%;
  margin: 1rem auto;
  .post-length {
    margin: 2rem 1rem;
    font-family: NotoSansKR-Medium;
    font-size: 1.3rem;
  }
`;

export const PostWrapper = styled.div`
  margin-bottom: 3rem;
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

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';

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
      const postsToShow = fetchedPosts.filter((post) => {
        const title = post.title ?? '';
        const bookTitle = post.bookTitle ?? '';
        return title.includes(searchQuery) || bookTitle.includes(searchQuery);
      });

      setPosts(searchQuery !== '' ? postsToShow : fetchedPosts);
    })();
  }, [searchQuery]);

  return (
    <Div>
      <p className="post-length">{`총 ${posts.length}개의 북로그`}</p>

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
