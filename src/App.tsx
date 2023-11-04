import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PostDetail from './components/post/PostDetail';
import PostEdit from './components/post/PostEdit';
import PostWrite from './components/post/PostWrite';
import { AuthProvider } from './context/Authcontext';
import Bookmarks from './pages/Bookmarks';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GlobalStyle from './styles/globalStyle';
import MyPosts from './pages/MyPosts';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/write" element={<PostWrite />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/myBookLog" element={<MyPosts />} />
          <Route path="/edit/:id" element={<PostEdit />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
