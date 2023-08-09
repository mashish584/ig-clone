import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Hub} from 'aws-amplify';
import {Auth, CognitoUser} from '@aws-amplify/auth';
import {HubCallback} from '@aws-amplify/core';
import {Alert} from 'react-native';

type UserType = CognitoUser | null | undefined;

type AuthContextType = {
  user: UserType;
  userId: string;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  userId: '',
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
    const hubSubscription = Hub.listen('auth', listener);
    return () => {
      hubSubscription();
    };
  }, []);

  return (
    <AuthContext.Provider value={{user, userId: user?.attributes.sub}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
