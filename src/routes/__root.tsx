import { createRootRoute, Outlet } from "@tanstack/react-router";
import useECDH from "../context/ECDH/useECDH";
import useAuth from "../context/auth/useAuth";
import { useEffect, useState } from "react";
import FullscreenLoader from "../components/fullscreenLoader/FullscreenLoader";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export const Route = createRootRoute({
  component: MainLayout,
});

function MainLayout() {
  const ECDH = useECDH();
  const auth = useAuth();
  const [showFullscreenLoading, setShowFullscreenLoading] = useState(true);

  useEffect(() => {
    if (auth.user.status !== "loading" && ECDH.value.status === "loaded") {
      setShowFullscreenLoading(false);
    }
  }, [auth, ECDH]);

  if (showFullscreenLoading) return <FullscreenLoader></FullscreenLoader>;

  return (
    <>
      <Navbar></Navbar>
      <main>
        <Outlet />
      </main>
      <Footer></Footer>
    </>
  );
}
