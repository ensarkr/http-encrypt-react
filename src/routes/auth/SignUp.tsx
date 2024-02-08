import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { requestSignUp } from "../../functions/requests";
import useECDH from "../../context/ECDH/useECDH";
import useAuth from "../../context/auth/useAuth";
import CustomButton from "../../components/customButton/CustomButton";
import CustomForm, {
  CustomFormCenter,
  CustomFormHeader,
} from "../../components/customForm/CustomForm";
import CustomInput from "../../components/customInput/CustomInputs";
import { useCustomButton } from "../../components/customButton/useCustomInput";
import { useCustomInput } from "../../components/customInput/useCustomInput";
import useSnackbar from "../../context/snackbar/useSnackbar";
import { getRandomColor } from "../../functions/randomColor";
import styles from "./auth.module.css";

export const Route = createFileRoute("/auth/SignUp")({
  component: SignUp,
});

function SignUp() {
  const [secondaryColor] = useState(getRandomColor("white"));
  const ECDH = useECDH();
  const auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const username = useCustomInput("Username", { length: { min: 4, max: 32 } });
  const password = useCustomInput("Password", { length: { min: 8, max: 32 } });
  const rePassword = useCustomInput("Repeat Password", {
    length: { min: 8, max: 32 },
  });
  const singUpButton = useCustomButton("clickable");
  const [formState, setFormState] = useState<"loading" | "clickable">(
    "clickable"
  );

  const handleSignUp = async () => {
    setFormState("loading");
    password.setErrorMessage(null);
    rePassword.setErrorMessage(null);

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
    if (!rePassword.validateInput()) return setFormState("clickable");
    if (password.state.trim() !== rePassword.state.trim()) {
      password.setErrorMessage(`Passwords do not match.`);
      rePassword.setErrorMessage(`Passwords do not match.`);
      return setFormState("clickable");
    }

    const res = await requestSignUp(
      ECDH.value.data,
      username.state,
      password.state,
      rePassword.state
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
          title={"SIGN UP"}
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
        <CustomInput
          state={rePassword.state}
          setState={rePassword.setState}
          errorMessage={rePassword.errorMessage}
          cleanErrorMessage={rePassword.cleanErrorMessage}
          isDisabled={formState === "loading"}
          secondaryColor={secondaryColor}
          placeholder="Repeat Password"
          hideCharacters={true}
        ></CustomInput>
        <CustomFormCenter>
          <span>
            Have an account?{"  "}
            <button
              onClick={() => navigate({ to: "/auth/SignIn" })}
              style={{ color: secondaryColor }}
            >
              Click to Sign In
            </button>
          </span>
        </CustomFormCenter>
        <CustomButton
          onClick={handleSignUp}
          secondaryColor={secondaryColor}
          state={
            ECDH.value.status === "loading" || formState === "loading"
              ? "loading"
              : singUpButton.state
          }
          title="SIGN UP"
        ></CustomButton>
      </CustomForm>
    </div>
  );
}
