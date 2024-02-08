import React, { ReactNode, useEffect, useState } from "react";
import {
  SetSnackbarContext,
  SnackbarContext,
  snackbarItemT,
} from "./useSnackbar";
import styles from "./snackbarProvider.module.css";
import { getRandomColor } from "../../functions/randomColor";

export default function SnackbarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [snackbar, setSnackbar] = useState<snackbarItemT[]>([]);

  return (
    <SetSnackbarContext.Provider value={setSnackbar}>
      <SnackbarContext.Provider value={snackbar}>
        <div className={styles.snackbarHolder}>
          {snackbar.map((e) => (
            <SnackbarItem
              key={e.id}
              snackbarItemData={e}
              setSnackbar={setSnackbar}
            ></SnackbarItem>
          ))}
        </div>
        {children}
      </SnackbarContext.Provider>
    </SetSnackbarContext.Provider>
  );
}

const snackbarItemDefaultColor = getRandomColor("white");

function SnackbarItem({
  snackbarItemData,
  setSnackbar,
}: {
  snackbarItemData: snackbarItemT;
  setSnackbar: React.Dispatch<React.SetStateAction<snackbarItemT[]>>;
}) {
  useEffect(() => {
    const timeout = setTimeout(
      () => setSnackbar((pv) => pv.filter((e) => e.id !== snackbarItemData.id)),
      2500
    );

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={styles.snackbarItem}
      style={{
        border:
          "1px solid " +
          (snackbarItemData.secondaryColor === undefined
            ? snackbarItemDefaultColor
            : snackbarItemData.secondaryColor),
      }}
    >
      {snackbarItemData.message}
    </div>
  );
}
