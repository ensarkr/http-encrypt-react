import { ReactNode } from "react";
import styles from "./customForm.module.css";

export default function CustomForm({
  secondaryColor,
  children,
}: {
  secondaryColor: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={styles.main}
      style={{ border: "1px solid " + secondaryColor }}
    >
      {children}
    </div>
  );
}

export function CustomFormHeader({
  title,
  secondaryColor,
}: {
  title: string;
  secondaryColor: string;
}) {
  return (
    <h1
      className={styles.header}
      style={{ borderBottom: "1px solid " + secondaryColor }}
    >
      {title}
    </h1>
  );
}

export function CustomFormError({ children }: { children?: ReactNode }) {
  return <div className={styles.error}>{children}</div>;
}

export function CustomFormCenter({ children }: { children?: ReactNode }) {
  return <div className={styles.center}>{children}</div>;
}
