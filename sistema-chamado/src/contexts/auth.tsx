import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebaseConnection";
import { toast } from "react-toastify";
import { IAuthContext, IAuthProvider } from "./Interface";

type dataType = {
  uid: string;
  nome: string;
  email: string | null;
  avatarUrl: string | null;
};

export const AuthContext = createContext({} as IAuthContext);

function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem("@tickets");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  //logar um user no sistema
  async function signIn(email: string, password: string) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let data: dataType = {
          uid: uid,
          nome: docSnap.data()?.name,
          email: value.user.email,
          avatarUrl: docSnap.data()?.avatarUrl,
        };
        //@ts-ignore
        setUser(data);
        storeUser(data);
        toast.success("Bem vindo de volta");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
        toast.error("Ops algo deu errado!");
      });
  }

  //cadastrar um novo user com firebase
  async function signUp(email: string, password: string, name: string) {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password).then(
      async (value) => {
        let uid = value.user.uid;

        await setDoc(doc(db, "users", uid), {
          name: name,
          avatarUrl: null,
        })
          .then(() => {
            let data: dataType = {
              uid: uid,
              nome: name,
              email: value.user.email,
              avatarUrl: null,
            };
            //@ts-ignore
            setUser(data);
            storeUser(data);
            setLoadingAuth(false);
            toast.success("Seja bem vindo ao sistema");
            navigate("/dashboard");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  }
  //envia os dados para o localStorage
  function storeUser(data: any) {
    localStorage.setItem("@tickets", JSON.stringify(data));
  }

  //desloga o usuario e remove os dados salvo no localStorage
  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@tickets");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storeUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
