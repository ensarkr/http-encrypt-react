import { useEffect, useState } from "react";
import { ecdhDataT } from "../../typings/crypt";
import { requestVerifySessionID } from "../../functions/requests";
import useECDH from "../ECDH/useECDH";
import { SetAuthContext, AuthContext, authT } from "./useAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<authT>({ status: "loading" });
  const ECDH = useECDH();

  useEffect(() => {
    if (ECDH.value.status === "loaded") initialUserValidation(ECDH.value.data);
  }, [ECDH.value.status]);

  const initialUserValidation = async (ECDHData: ecdhDataT) => {
    const sessionID = localStorage.getItem("session_id");

    if (sessionID === null) {
      setAuth({ status: "guest" });
      return;
    }

    const verifyStatus = await requestVerifySessionID(ECDHData, sessionID);

    if (!verifyStatus.status) {
      setAuth({ status: "guest" });
      return;
    }

    setAuth({ status: "user", data: { ...verifyStatus.value, sessionID } });
  };

  return (
    <SetAuthContext.Provider value={setAuth}>
      <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    </SetAuthContext.Provider>
  );
}
