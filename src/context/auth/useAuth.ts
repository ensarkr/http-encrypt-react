import { createContext, useContext, useMemo } from "react";
import { userT } from "../../typings/user";

type authT =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "user"; data: userT & { sessionID: string } };

const AuthContext = createContext<authT>({ status: "loading" });
const SetAuthContext = createContext<React.Dispatch<
  React.SetStateAction<authT>
> | null>(null);

export default function useAuth() {
  const auth = useContext(AuthContext);
  const setAuth = useContext(SetAuthContext);

  if (setAuth === null) {
    throw "setAuth is unaccessible";
  }

  const updateAuth = (user: userT, sessionID: string) => {
    localStorage.setItem("session_id", sessionID);
    setAuth({ status: "user", data: { ...user, sessionID } });
  };

  const signOut = () => {
    const sessionID = localStorage.getItem("session_id");

    if (sessionID !== null) {
      localStorage.removeItem("session_id");
    }

    setAuth({ status: "guest" });
  };

  return useMemo(() => {
    return {
      user: auth,
      updateAuth,
      signOut,
    };
  }, [auth]);
}

export { AuthContext, SetAuthContext, authT };
