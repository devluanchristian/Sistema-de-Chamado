import format from "date-fns/format";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
import { IAuthContext } from "../../contexts/Interface";
import { db } from "../../services/firebaseConnection";
import logo from "../../assets/loadingRoxo.gif";
import "./styles.css";
import Modal from "../../components/Modal";

interface IPropsDoc {
  id: string;
  cliente: string;
  clienteId: string;
  assunto: string;
  createdFormat: string;
  status: string;
}

const Dashboard = () => {
  const { logout }: IAuthContext = useContext(AuthContext);

  async function handleLogout() {
    await logout();
  }
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState({});
  const getList = collection(db, "tickets");

  useEffect(() => {
    const loadTicket = async () => {
      const q = query(getList, orderBy("created", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      setTickets([]);

      await updateState(querySnapshot);

      setLoading(false);
    };
    loadTicket();
    return () => {};
  }, []);

  const updateState = async (querySnapshot: any) => {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista: {
        id: string;
        assunto: string;
        cliente: string;
        clienteId: string;
        status: string;
        complemento: string;
        createdFormat: string;
      }[] = [];

      querySnapshot.forEach((doc: any) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          status: doc.data().status,
          complemento: doc.data().complemento,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      //pegando o ultimo item

      setTickets((tickets: any) => [...tickets, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }
    setLoadingMore(false);
  };
  const toggleModal = (item: IPropsDoc) => {
    setShowPostModal(!showPostModal);
    setDetail(item);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <img className="loadingDashboard" src={logo} alt="carregando" />
          </div>
        </div>
      </div>
    );
  }
  const handleMore = async () => {
    setLoadingMore(true);
    const q = query(
      getList,
      orderBy("created", "desc"),
      startAfter(lastDocs),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  };
  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>
        <>
          {tickets.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum Ticket encontrado...</span>
              <Link to={"/new"} className="new">
                <FiPlus color="#FFF" size={25} />
                Abrir novo Ticket
              </Link>
            </div>
          ) : (
            <>
              <Link to={"/new"} className="new">
                <FiPlus color="#FFF" size={25} />
                Abrir novo Ticket
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((item: IPropsDoc, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                item.status === "Aberto"
                                  ? "#5ec75f"
                                  : "#999" || item.status === "Concluido"
                                  ? "#0074a1"
                                  : "#999",
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button
                            className="action"
                            style={{ backgroundColor: "#3583f6" }}
                            onClick={() => toggleModal(item)}
                          >
                            <FiSearch color="#FFF" size={17} />
                          </button>
                          <Link
                            to={`/new/${item.id}`}
                            className="action"
                            style={{ backgroundColor: "#f6a935" }}
                          >
                            <FiEdit2 color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {loadingMore && <h3>Buscando mais tickets...</h3>}
              {!loadingMore && !isEmpty && (
                <button className="btn-more" onClick={handleMore}>
                  Buscar mais
                </button> //Isso exibirá o botão "Buscar mais" somente quando houver mais tickets a serem carregados
              )}
            </>
          )}
        </>
      </div>
      {showPostModal && (
        <Modal
        //@ts-ignore
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)}
        />
      )}
    </div>
  );
};

export default Dashboard;
