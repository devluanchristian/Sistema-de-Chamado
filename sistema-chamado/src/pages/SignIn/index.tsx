import "./styles.css";
import logo from "../../assets/logoxx.png";
import logo2 from "../../assets/loading.gif";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext} from "../../contexts/auth";
import { IAuthContext } from "../../contexts/Interface";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, loadingAuth }: IAuthContext = useContext(AuthContext);

  async function handleSignIn(e:any) {
    e.preventDefault();
    if (email && password !== "") {
      await signIn(email, password);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema de chamados" />
          <h2>CallingSystem</h2>
        </div>
        <form onSubmit={handleSignIn}>
          <h1>Entrar</h1>
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? (
              <img className="loandigImg" src="https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif"></img>
            ) : (
              "Acessar"
            )}
          </button>
        </form>
        <Link to={"/register"}>Criar uma conta </Link>
      </div>
    </div>
  );
};

export default SignIn;
