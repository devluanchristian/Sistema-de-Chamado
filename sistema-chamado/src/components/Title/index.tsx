import "./styles.css";

const Title = ({ children, name }: any) => {
  return (
    <div className="title">
      {children}
      <span>{name}</span>
    </div>
  );
};

export default Title;
