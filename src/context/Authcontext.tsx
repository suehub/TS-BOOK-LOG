import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth } from '../firebase';
import { type FirebaseError } from 'firebase/app';
import Swal from 'sweetalert2';

type FirebaseUser = User;

// AuthContext의 타입 지정
interface AuthContextType {
  currentUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>; // 로그인 함수 추가
  logout: () => Promise<void>; // 로그아웃 함수 추가
  resetPassword: (email: string) => Promise<void>; // 비밀번호 재설정 함수
  googleLogin: () => Promise<void>; // 구글 로그인 함수 추가
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // 사용자 인증 상태를 추적하고 currentUser 값을 설정
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 컨텍스트 값을 useMemo를 사용하여 메모이제이션
  const value = useMemo(() => {
    return {
      currentUser,
      login: async (email: string, password: string) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          // 로그인 실패 처리
          console.error('로그인 실패:', error);
          throw error;
        }
      },
      logout: async () => {
        // 로그아웃 함수 정의
        try {
          await auth.signOut();
        } catch (error) {
          console.error('로그아웃 실패:', error);
          throw error;
        }
      },
      resetPassword: async (email: string) => {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (error) {
          console.error('비밀번호 재설정 이메일 전송 실패:', error);
          throw error;
        }
      },
      googleLogin: async () => {
        try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          void Swal.fire('로그인', 'Google 로그인 되었습니다.', 'success');
        } catch (error) {
          const firebaseError = error as FirebaseError;
          if (firebaseError.code === 'auth/popup-closed-by-user') {
            void Swal.fire(
              '로그인',
              'Google 창이 닫혀 로그인에 실패하였습니다.',
              'error'
            );
          } else {
            void Swal.fire(
              '로그인',
              'Google 로그인에 실패하였습니다.',
              'error'
            );
          }
          throw error; // 필요에 따라 오류를 다시 던질 수 있습니다.
        }
      },
    };
  }, [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
