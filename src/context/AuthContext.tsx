import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {Auth, Hub} from 'aws-amplify';
import {HubCallback} from '@aws-amplify/core';

type UserType = CognitoUser | null | undefined;

type AuthContextType = {
  user: UserType;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
});

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<UserType>(undefined);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      setUser(authUser);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener: HubCallback = data => {
      const {event} = data.payload;
      if (event === 'signOut') {
        setUser(null);
      }

      if (event === 'signIn') {
        checkUser();
      }
    };
    Hub.listen('auth', listener);
    return () => {
      Hub.remove('auth', listener);
    };
  }, []);

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Context not wrapped.');
  }
  return context;
}

export default AuthContext;
export {AuthContextProvider, useAuthContext};
