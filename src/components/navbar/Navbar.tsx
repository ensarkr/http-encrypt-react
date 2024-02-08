import { useNavigate } from "@tanstack/react-router";
import useAuth from "../../context/auth/useAuth";
import styles from "./navbar.module.css";
import Logo from "../logo/Logo";

export default function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.content}>
        <button onClick={() => navigate({ to: "/" })}>
          <Logo></Logo>
        </button>

        <div className={styles.right}>
          {auth.user.status === "user" && (
            <>
              <div className={styles.username}>{auth.user.data.username}</div>
              <button
                onClick={() => {
                  auth.signOut();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{
                    fill: "rgba(255, 255, 255, 1)",
                    verticalAlign: "bottom",
                  }}
                >
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path>
                  <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path>
                </svg>
              </button>
            </>
          )}
          {auth.user.status === "guest" && (
            <>
              <button
                onClick={() => {
                  navigate({ to: "/auth/SignIn" });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{
                    fill: "rgba(255, 255, 255, 1)",
                    verticalAlign: "bottom",
                  }}
                >
                  <path d="m13 16 5-4-5-4v3H4v2h9z"></path>
                  <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
