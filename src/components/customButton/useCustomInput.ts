import { useState } from "react";
import { customButtonStatesT } from "./CustomButton";

export function useCustomButton(initialButtonState: customButtonStatesT) {
  const [buttonState, setButtonState] =
    useState<customButtonStatesT>(initialButtonState);

  return { state: buttonState, setState: setButtonState };
}
