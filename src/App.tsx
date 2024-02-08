import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import SnackbarProvider from "./context/snackbar/SnackbarProvider";
import ECDHProvider from "./context/ECDH/ECDHProvider";
import AuthProvider from "./context/auth/AuthProvider";
import "../browserify/browserify";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <SnackbarProvider>
      <ECDHProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ECDHProvider>
    </SnackbarProvider>
  );
}
