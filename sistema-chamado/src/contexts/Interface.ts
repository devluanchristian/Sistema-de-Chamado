type UserType = {
  avatarUrl: string | boolean;
};

export interface IAuthContext {
  signed: boolean;
  user: UserType | any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
  storeUser: (data: any) => void;
  setUser: React.Dispatch<React.SetStateAction<null>>;
}

export interface IAuthProvider {
  children: React.ReactNode;
}
