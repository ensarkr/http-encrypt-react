import { createContext, useContext, useMemo } from "react";

type snackbarItemT = { id: string; message: string; secondaryColor?: string };
const SnackbarContext = createContext<snackbarItemT[]>([]);
const SetSnackbarContext = createContext<React.Dispatch<
  React.SetStateAction<snackbarItemT[]>
> | null>(null);

export default function useSnackbar() {
  const setSnackbar = useContext(SetSnackbarContext);

  if (setSnackbar === null) throw "setSnackbar is not defined.";

  const addSnackbarItem = (
    item: Pick<snackbarItemT, "message" | "secondaryColor">
  ) => {
    setSnackbar((pv) => [...pv, { id: Math.random().toString(), ...item }]);
  };

  return useMemo(() => {
    return {
      addSnackbarItem,
    };
  }, []);
}

export { SnackbarContext, SetSnackbarContext, useSnackbar, snackbarItemT };
