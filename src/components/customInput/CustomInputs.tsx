import styles from "./customInput.module.css";

type customInputProps = {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  secondaryColor: string;
  isDisabled?: boolean;
  errorMessage: null | string;
  cleanErrorMessage: () => void;
  placeholder: string;
  hideCharacters?: boolean;
};

export default function CustomInput({
  state,
  setState,
  secondaryColor,
  isDisabled,
  errorMessage,
  cleanErrorMessage,
  placeholder,
  hideCharacters,
}: customInputProps) {
  return (
    <div className={styles.main}>
      <input
        className={styles.input}
        value={state}
        onChange={(e) => {
          if (errorMessage !== null) cleanErrorMessage();
          setState(e.target.value);
        }}
        disabled={isDisabled}
        style={{ border: "1px solid " + secondaryColor }}
        placeholder={placeholder}
        type={hideCharacters ? "password" : "text"}
      ></input>
      <p className={styles.error}>{errorMessage}</p>
    </div>
  );
}
