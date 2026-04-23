import React from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { UserProps } from 'src/sections/user/user-table-row';

type TContext = {
  isLogin: boolean;
  toggleLogin: () => void;
  user: UserProps | null;
};

const LoginContext = React.createContext<TContext>({
  isLogin: false,
  toggleLogin: () => {},
  user: null,
});

interface Props {
  children: React.ReactNode;
}

export const LoginContextProvider: React.FC<Props> = (props) => {
  const [isLogin, setIsLogin] = useLocalStorage('isLogin', false);
  const user = localStorage.getItem('user') || '{}';
  localStorage.setItem('access-token', JSON.parse(user).token);

  function toggleLogin() {
    setIsLogin((prev) => !prev);
    localStorage.setItem('user', '{}');
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const loginValue: TContext = {
    isLogin,
    toggleLogin,
    user: JSON.parse(user),
  };

  // eslint-disable-next-line react/destructuring-assignment
  return <LoginContext.Provider value={loginValue}>{props.children}</LoginContext.Provider>;
};

export default LoginContext;
