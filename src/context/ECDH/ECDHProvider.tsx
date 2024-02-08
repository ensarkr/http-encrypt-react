import { ReactNode, useEffect, useState } from "react";
import {
  ECDHContext,
  ECDHContextT,
  ECDHSetupContext,
  setECDHContext,
} from "./useECDH";
import useSnackbar from "../snackbar/useSnackbar";

export default function ECDHProvider({ children }: { children: ReactNode }) {
  const [ECDH, setECDH] = useState<ECDHContextT>({
    status: "loading",
  });
  const snackbar = useSnackbar();

  useEffect(() => {
    ECDHSetupContext(snackbar, setECDH);
  }, []);

  return (
    <setECDHContext.Provider value={setECDH}>
      <ECDHContext.Provider value={ECDH}>{children}</ECDHContext.Provider>
    </setECDHContext.Provider>
  );
}
