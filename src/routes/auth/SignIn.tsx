import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { requestSignIn } from "../../functions/requests";
import CustomButton from "../../components/customButton/CustomButton";
import CustomForm, {
  CustomFormCenter,
  CustomFormHeader,
} from "../../components/customForm/CustomForm";
import { useCustomButton } from "../../components/customButton/useCustomInput";
import { useCustomInput } from "../../components/customInput/useCustomInput";
import CustomInput from "../../components/customInput/CustomInputs";
import styles from "./auth.module.css";
import useSnackbar from "../../context/snackbar/useSnackbar";
import useECDH from "../../context/ECDH/useECDH";
import useAuth from "../../context/auth/useAuth";
import { getRandomColor } from "../../functions/randomColor";

export const Route = createFileRoute("/auth/SignIn")({
  component: SignIn,
});

function SignIn() {
  const [secondaryColor] = useState(getRandomColor("white"));
  const ECDH = useECDH();
  const auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const username = useCustomInput("Username", { length: { min: 4, max: 32 } });
  const password = useCustomInput("Password", { length: { min: 8, max: 32 } });
  const singUpButton = useCustomButton("clickable");
  const [formState, setFormState] = useState<"loading" | "clickable">(
    "clickable"
  );

  const handleSignIn = async () => {
    setFormState("loading");

    if (ECDH.value.status !== "loaded") {
      if (ECDH.value.status === "error")
        snackbar.addSnackbarItem({
          message: ECDH.value.message,
          secondaryColor,
        });
      return setFormState("clickable");
    }
    if (!username.validateInput()) return setFormState("clickable");
    if (!password.validateInput()) return setFormState("clickable");

    const res = await requestSignIn(
      ECDH.value.data,
      username.state,
      password.state
    );

    if (!res.status) {
      if (res.actions?.includes("resetKeyExchange")) ECDH.retryECDH();

      snackbar.addSnackbarItem({ message: res.message, secondaryColor });
      return setFormState("clickable");
    }

    auth.updateAuth(
      { userID: res.value.userID, username: res.value.username },
      res.value.sessionID
    );

    setFormState("clickable");

    snackbar.addSnackbarItem({
      message: `Signed in as ${res.value.username}.`,
      secondaryColor,
    });
    navigate({ to: "/" });
  };

  return (
    <div className={styles.main}>
      <CustomForm secondaryColor={secondaryColor}>
        <CustomFormHeader
          title={"SIGN IN"}
          secondaryColor={secondaryColor}
        ></CustomFormHeader>
        <CustomInput
          state={username.state}
          setState={username.setState}
          errorMessage={username.errorMessage}
          cleanErrorMessage={username.cleanErrorMessage}
          isDisabled={formState === "loading"}
          secondaryColor={secondaryColor}
          placeholder="Username"
        ></CustomInput>
        <CustomInput
          state={password.state}
          setState={password.setState}
          errorMessage={password.errorMessage}
          cleanErrorMessage={password.cleanErrorMessage}
          isDisabled={formState === "loading"}
          secondaryColor={secondaryColor}
          placeholder="Password"
          hideCharacters={true}
        ></CustomInput>
        <CustomFormCenter>
          <span>
            No account?{"  "}
            <button
              onClick={() => navigate({ to: "/auth/SignUp" })}
              style={{ color: secondaryColor }}
            >
              Click to Sign Up
            </button>
          </span>
        </CustomFormCenter>
        <CustomButton
          onClick={handleSignIn}
          secondaryColor={secondaryColor}
          state={
            ECDH.value.status === "loading" || formState === "loading"
              ? "loading"
              : singUpButton.state
          }
          title="SIGN IN"
        ></CustomButton>
      </CustomForm>
    </div>
  );
}
