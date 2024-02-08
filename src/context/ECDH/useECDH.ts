import { createContext, useCallback, useContext } from "react";
import { startKeyExchangeECDH } from "../../functions/ecdh";
import { ecdhDataT } from "../../typings/crypt";
import useSnackbar from "../snackbar/useSnackbar";

type ECDHContextT =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; data: ecdhDataT };

const ECDHContext = createContext<ECDHContextT>({ status: "loading" });
const setECDHContext = createContext<React.Dispatch<
  React.SetStateAction<ECDHContextT>
> | null>(null);

export default function useECDH() {
  const ECDH = useContext(ECDHContext);
  const setECDH = useContext(setECDHContext);
  const snackbar = useSnackbar();

  if (setECDH === null) throw "setECDH not set.";

  const retryECDH = useCallback(() => {
    setECDH({ status: "loading" });
    ECDHSetupContext(snackbar, setECDH);
  }, []);

  return {
    value: ECDH,
    retryECDH,
  };
}

async function ECDHSetupContext(
  snackbar: ReturnType<typeof useSnackbar>,
  setECDH: React.Dispatch<React.SetStateAction<ECDHContextT>>
) {
  const res = await startKeyExchangeECDH();

  if (!res.status) {
    snackbar.addSnackbarItem({ message: res.message });
    return setECDH({ status: "error", message: res.message });
  } else setECDH({ status: "loaded", data: res.value });
}

export { ECDHContext, setECDHContext, ECDHContextT, ECDHSetupContext };
