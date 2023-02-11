import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

export default function Private({ children }: any) {
  const { signed, loading }: any = useContext(AuthContext);
  console.log(signed);

  if (loading) {
    return (
        <div>
            
        </div>
    );
  }

  if (!signed) {
    return <Navigate to={"/"}></Navigate>;
  }

  return children;
}
