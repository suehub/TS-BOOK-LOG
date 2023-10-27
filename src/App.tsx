import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import GlobalStyle from './styles/globalStyle';
import Login from './pages/Login';
import { AuthProvider } from './context/Authcontext';
import Signup from './pages/Signup';
const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
