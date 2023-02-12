import "./styles.css";
import logo from "../../assets/logoxx.png";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { IAuthContext } from "../../contexts/Interface";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, loadingAuth }: IAuthContext = useContext(AuthContext);

  async function handleSignUp(e: any) {
    e.preventDefault();

    if (name && password && email !== "") {
      await signUp(email, password, name);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema de chamados" />
          <h2>CallingSystem</h2>
        </div>
        <form onSubmit={handleSignUp}>
          <h1>Nova Conta</h1>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha deve conter no mínimo 6 caracteres"
            value={password}
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? (
              <img
                className="loandigImg"
                src="https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif"
              ></img>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        <Link to={"/"}>Já possuo uma conta!</Link>
      </div>
    </div>
  );
};

export default SignUp;
