import { useState } from "react";
import useECDH from "../../context/ECDH/useECDH";
import CircleLoader from "../circleLoader/CircleLoader";
import CustomButton from "../customButton/CustomButton";
import styles from "./fullscreenLoader.module.css";
import { getRandomColor } from "../../functions/randomColor";
import useAuth from "../../context/auth/useAuth";
import Logo from "../logo/Logo";

export default function FullscreenLoader() {
  const ECDH = useECDH();
  const auth = useAuth();
  const [randomColor] = useState(getRandomColor("white"));

  return (
    <div className={styles.main}>
      <Logo></Logo>
      <div className={styles.buttonDiv}>
        {ECDH.value.status === "error" ? (
          <CustomButton
            onClick={ECDH.retryECDH}
            secondaryColor={randomColor}
            state={"clickable"}
            title={"RETRY"}
          ></CustomButton>
        ) : ECDH.value.status === "loading" ||
          auth.user.status === "loading" ? (
          <CircleLoader color="white" height="60%"></CircleLoader>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
