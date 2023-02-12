import "./styles.css";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiSettings } from "react-icons/all";
import { FiUpload } from "react-icons/all";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { IAuthContext } from "../../contexts/Interface";
import avatar from "../../assets/avatar.png";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Profile = () => {
  const { user, storeUser, setUser, logout }: IAuthContext =
    useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [nome, setNome] = useState(user && user.nome);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [email, setEmail] = useState(user && user.email);

  const handleFile = (e: { target: { files: any } }) => {
    console.log(e.target.files);

    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert("Não é permitido esse formato de imagem");
        setImageAvatar(null);
        return;
      }
    }
  };

  const handleUpload = async () => {
    const currentUid = user.uid;
    //@ts-ignore

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar?.name}`);
    //@ts-ignore
    const uploadTask = uploadBytes(uploadRef, imageAvatar).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (dowloadURL) => {
        let urlFoto = dowloadURL;
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          avatarUrl: urlFoto,
          nome: nome,
        }).then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          };
          setUser(data);
          storeUser(data);
          toast.success("Alteração feita com sucesso!");
        });
      });
    });
  };

  const handleSubmit = async (e: { preventDefault: any }) => {
    e.preventDefault();
    if (imageAvatar == null && nome !== "") {
      //atualizar apenas o nome do user

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nome: nome,
      }).then(() => {
        let data = {
          ...user, //todas informaçõesdo nosso user do contexto
          nome: nome,
        };
        setUser(data);
        storeUser(data);
        toast.success("Alteração feita com sucesso!");
      });
    } else if (nome !== "" && imageAvatar !== null) {
      //Atualiza nome e a foto
      handleUpload();
    }
  };

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#fff" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={handleFile} />
              <br />
              {avatarUrl == null ? (
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  width={250}
                  height={250}
                ></img>
              ) : (
                <img
                  src={avatarUrl}
                  alt="Foto de perfil"
                  width={250}
                  height={250}
                />
              )}
            </label>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>Email</label>
            <input type="email" value={email} disabled={true} />
            <button type="submit">Salvar</button>
          </form>
        </div>
        <div className="container">
          <button className="logout-btn" onClick={() => logout()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
