import CircleLoader from "../circleLoader/CircleLoader";
import styles from "./customButton.module.css";

export type customButtonStatesT =
  | "loading"
  | "disabled"
  | "clickable";

type customButtonProps = {
  onClick: () => void;
  secondaryColor: string;
  state: customButtonStatesT;
  title: string;
};

export default function CustomButton({
  onClick,
  secondaryColor,
  state,
  title,
}: customButtonProps) {
  return (
    <>
      <button
        className={styles.main}
        disabled={state === "disabled" || state === "loading"}
        onClick={onClick}
        style={{ backgroundColor: secondaryColor }}
      >
        {state === "loading" ? (
          <CircleLoader color="white" height="50%"></CircleLoader>
        ) : (
          title
        )}
      </button>
    </>
  );
}
