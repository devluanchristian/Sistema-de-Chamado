import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./styles.css";

type detailDTO = {
  cliente: string;
  assunto: string;
  status: string;
  createdFormat: string;
  complemento: string;
};

interface IProps {
  close: () => void;
  conteudo: detailDTO;
}

const Modal = ({ conteudo, close }: IProps) => {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={25} color="#fff" />
          Voltar
        </button>
        <main>
          <h2>Detalhes do ticket</h2>
          <div className="row">
            <span>
              Cliente: <i>{conteudo.cliente}</i>
            </span>
          </div>
          <div className="row">
            <span>
              Assunto: <i>{conteudo.assunto}</i>
            </span>
            <span>
              Cadastrado em <i>{conteudo.createdFormat}</i>
            </span>
          </div>
          <div className="row">
            <span>
              Status: <i style={{color: "#FFF", backgroundColor: conteudo.status === "Aberto" ? "#5ec75f": "#999"}}>{conteudo.status}</i>
            </span>
          </div>

          {conteudo.complemento != "" && (
            <>
              <h3>Complemento</h3>
              <p>{conteudo.complemento}</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Modal;
