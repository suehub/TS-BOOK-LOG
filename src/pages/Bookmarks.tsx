import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import PostItem from '../components/home/PostItem';
import { Div, PostWrapper, type Post } from '../components/home/PostList';
import { useAuth } from '../context/Authcontext';
import { db } from '../firebase';

const Wrapper = styled.div`
  > main {
    width: 95%;
    min-height: 80vh;
    margin: 0 auto;
  }
`;

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchBookmarkedPosts = async (): Promise<void> => {
      if (currentUser?.uid != null) {
        const bookmarksRef = collection(db, 'bookmarks');
        const q = query(bookmarksRef, where('userId', '==', currentUser.uid));
        const bookmarkedSnapshots = await getDocs(q);

        const postPromises = bookmarkedSnapshots.docs.map(
          async (docSnapshot) => {
            const postId = docSnapshot.data().postId;
            const postRef = doc(db, 'posts', postId);
            const postSnap = await getDoc(postRef);
            return { id: postSnap.id, ...(postSnap.data() as Post) };
          }
        );

        const bookmarkedPosts = await Promise.all(postPromises);
        setPosts(bookmarkedPosts);
      }
    };

    void fetchBookmarkedPosts();
  }, [currentUser]);

  return (
    <Wrapper>
      <Header />
      <main>
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
      </main>

      <Footer />
    </Wrapper>
  );
};

export default Bookmarks;
