import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import PostItem from '../components/home/PostItem';
import { Div, PostWrapper, type Post } from '../components/home/PostList';
import { useAuth } from '../context/Authcontext';
import { db } from '../firebase';
import { Wrapper } from './Bookmarks';

const MyPosts: React.FC = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchMyPosts = async (): Promise<void> => {
      if (currentUser?.uid != null) {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('authorId', '==', currentUser.uid));
        const myPostSnapshots = await getDocs(q);

        const myPosts = myPostSnapshots.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Post),
        }));

        setPosts(myPosts);
      }
    };

    void fetchMyPosts();
  }, [currentUser]);

  return (
    <Wrapper>
      <Header />
      <main>
        <Div>
          {posts.length === 0 ? (
            <p className="post-length">작성한 북로그가 존재하지 않습니다</p>
          ) : (
            <p className="post-length">총 {posts.length}개의 내 북로그</p>
          )}

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
      </main>

      <Footer />
    </Wrapper>
  );
};

export default MyPosts;
