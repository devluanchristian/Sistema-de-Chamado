import { addDoc, collection, doc } from "firebase/firestore";
import { useContext, useState } from "react";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
import { IAuthContext } from "../../contexts/Interface";
import { db } from "../../services/firebaseConnection";

const Customers = () => {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

  const { loadingAuth }: IAuthContext = useContext(AuthContext);

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (nome && cnpj && endereco !== "") {
      await addDoc(collection(db, "customers"), {
        nomeFantasia: nome,
        cnpj: cnpj,
        endereco: endereco,
      })
        .then(() => {
          setNome("");
          setCnpj("");
          setEndereco("");
          toast.success("Empresa registrada com sucesso!");
        })
        .catch(() => {
          toast.error("Erro ao fazer o cadastro.");
        });
    } else {
      toast.error("Preencha todos os campos");
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Nome fatansia</label>
            <input
              type="text"
              placeholder="Nome da empresa"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              maxLength={14}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endereço</label>
            <input
              type="text"
              placeholder="Endereço da empresa"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Customers;
