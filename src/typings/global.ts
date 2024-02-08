type possibleActionsOnFalseT = "resetKeyExchange" | "signOut";

type doubleReturn<T> = T extends undefined
  ?
      | { status: true }
      | {
          status: false;
          message: string;
          actions?: possibleActionsOnFalseT[];
        }
  :
      | { status: true; value: T }
      | {
          status: false;
          message: string;
          actions?: possibleActionsOnFalseT[];
        };

export { doubleReturn };
