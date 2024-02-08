import { useState } from "react";

type validationsT = {
  length?: { min: number; max: number };
};

export function useCustomInput(UIName: string, validations?: validationsT) {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const validateInput = () => {
    if (validations === undefined) return true;

    const trimmedInputValue = inputValue.trim();
    setInputValue(trimmedInputValue);

    if (validations.length !== undefined) {
      if (trimmedInputValue.length < validations.length.min) {
        setErrorMessage(
          `${UIName} must be longer than ${validations.length.min} characters.`
        );
        return false;
      }
      if (trimmedInputValue.length > validations.length.max) {
        setErrorMessage(
          `${UIName} must be shorter than ${validations.length.min} characters.`
        );
        return false;
      }
    }

    return true;
  };

  return {
    state: inputValue,
    setState: setInputValue,
    errorMessage,
    setErrorMessage,
    cleanErrorMessage: () => setErrorMessage(null),
    validateInput,
  };
}
