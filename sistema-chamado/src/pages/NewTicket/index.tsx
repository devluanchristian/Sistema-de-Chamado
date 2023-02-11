import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
import { IAuthContext } from "../../contexts/Interface";
import { db } from "../../services/firebaseConnection";
import "./styles.css";

interface IPropsCollection {
  nomeFantasia: string;
}

const getList = collection(db, "customers");
const NewTicket = () => {
  const { user }: IAuthContext = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any>([]);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [complemento, setComplemento] = useState("");
  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");
  const [idCustomer, setIdCustomer] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      console.log(id);
      const querySnapshot = await getDocs(getList)
        .then((snapShot) => {
          let lista: { [key: string]: any }[] = [];
          snapShot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
            });
          });
          if (snapShot.docs.length === 0) {
            console.log("NEHUMA EMPRESA ENCONTRADA");
            setCustomers([{ id: "1", nomeFantasia: "Nome" }]);
            setLoadCustomer(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomer(false);
          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao buscar clientes");
          setLoadCustomer(false);
          setCustomers([{ id: "1", nomeFantasia: "Nome" }]);
        });
    };
    loadCustomers();
  }, [id]);

  const loadId = async (lista: { [key: string]: any }[]) => {
    //@ts-ignore
    const docRef = doc(db, "tickets", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data()?.assunto);
        setStatus(snapshot.data()?.status);
        setComplemento(snapshot.data()?.complemento);

        let index = lista.findIndex(
          (item) => item.id === snapshot.data()?.clienteId
        );
        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch((error) => {
        console.log(error);
        setIdCustomer(false);
      });
  };

  const handleOptionChange = (e: any) => {
    setStatus(e.target.value);
  };
  const handleChangeSelection = (e: any) => {
    setAssunto(e.target.value);
  };
  const handleChangeCustomer = (e: any) => {
    setCustomerSelected(e.target.value);
  };
  const handleREgister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (idCustomer) {
      //atualizando tickets
      //@ts-ignore
      const docRef = doc(db, "tickets", id);

      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
        .then(() => {
          toast.info("Atualizado com  sucesso");
          setCustomerSelected(0);
          setComplemento("");
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error("Ops error ao atualizar esse ticket");
        });
      return;
    }

    //Registrar ticket
    await addDoc(collection(db, "tickets"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Registrado");
        setComplemento("");
        setCustomerSelected(0);
      })
      .catch((error) => {
        toast.error("Ops erro ao registrar o ticket, tente mais tarde");
        console.log(error);
      });
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name={id ? "Editando ticket" : "Novo Ticket"}>
          <FiPlusCircle size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleREgister}>
            <label>Clientes</label>
            {loadCustomer ? (
              <input type="text" disabled={true} value={"Carregando"} />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomer}>
                {customers.map((item: IPropsCollection, index: any) => {
                  return (
                    <option key={index} value={index}>
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelection}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value={"Aberto"}
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Em Aberto</span>
              <input
                type="radio"
                name="radio"
                value={"Executanto"}
                onChange={handleOptionChange}
                checked={status === "Executanto"}
              />
              <span>Executanto</span>
              <input
                type="radio"
                name="radio"
                value={"Concluido"}
                onChange={handleOptionChange}
                checked={status === "Concluido"}
              />
              <span>Concluido</span>
            </div>
            <label>Complemento</label>
            <textarea
              placeholder="Descreva seu problema (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
