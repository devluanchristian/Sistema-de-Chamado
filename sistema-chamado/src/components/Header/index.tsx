import { useContext } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import avatarImg from "../../assets/avatar.png";
import { AuthContext } from "../../contexts/auth";
import { AiOutlineHome } from "react-icons/all";
import { BiUser } from "react-icons/all";
import { FiSettings } from "react-icons/all";
import { IAuthContext } from "../../contexts/Interface";

const Header = () => {
  const { user }: IAuthContext = useContext(AuthContext);
  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl == null ? avatarImg : user.avatarUrl}
          alt="Foto do usuario"
        />
      </div>

      <Link to={"/dashboard"}>
        <AiOutlineHome color="#FFF" size={24} />
        Tickets
      </Link>
      <Link to={"/customers"}>
        <BiUser color="#FFF" size={24} />
        Clientes
      </Link>
      <Link to={"/profile"}>
        <FiSettings color="#FFF" size={24} />
        Perfil
      </Link>
    </div>
  );
};

export default Header;
