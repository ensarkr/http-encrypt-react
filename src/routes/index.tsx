import { createFileRoute } from "@tanstack/react-router";
import { requestRandomMovies } from "../functions/requests";
import useECDH from "../context/ECDH/useECDH";
import useAuth from "../context/auth/useAuth";
import { useEffect, useState } from "react";
import { movieDetailT } from "../typings/tmdb";
import useSnackbar from "../context/snackbar/useSnackbar";
import { getRandomColor } from "../functions/randomColor";
import MultipleCards from "../components/multipleCards/MultipleCards";

export const Route = createFileRoute("/")({
  component: Home,
});

type cardStatesT = "signIn" | "retry" | "loading" | "loadingMovies" | "loaded";

export type cardTypesT =
  | (movieDetailT & { status: "loaded"; color: string })
  | {
      status: "loadMore";
      usersTotalMovieCount: number | null;
      color: string;
    }
  | {
      status: "signIn" | "retry" | "loading" | "loadingMovies";
      color: string;
    };

const defaultColor = getRandomColor("white");

function Home() {
  const ECDH = useECDH();
  const auth = useAuth();
  const snackbar = useSnackbar();
  const [cards, setCards] = useState<cardTypesT[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [fetchStatus, setFetchStatus] = useState<
    "loading" | "error" | "functional"
  >(auth.user.status === "user" ? "loading" : "functional");

  // * auth cannot be loading here it can be either user or guest
  const cardState: cardStatesT =
    ECDH.value.status === "error" || fetchStatus === "error"
      ? "retry"
      : auth.user.status !== "user"
        ? "signIn"
        : fetchStatus === "loading"
          ? "loadingMovies"
          : ECDH.value.status === "loading"
            ? "loading"
            : "loaded";

  const fetchAndSetMovies = async () => {
    setCurrentCardIndex(0);
    if (auth.user.status !== "user") {
      return snackbar.addSnackbarItem({
        message: "You have to sign in to see random movies.",
      });
    }

    if (ECDH.value.status !== "loaded") {
      ECDH.retryECDH();
      return snackbar.addSnackbarItem({
        message: "ECDH is invalid try again.",
      });
    }
    setFetchStatus("loading");

    const res = await requestRandomMovies(
      ECDH.value.data,
      auth.user.data.sessionID
    );

    if (!res.status) {
      if (res.actions?.includes("resetKeyExchange")) ECDH.retryECDH();
      setFetchStatus("error");

      return snackbar.addSnackbarItem({
        message: res.message,
      });
    }

    setFetchStatus("functional");
    setCards([
      ...res.value.randomMovies.map((e) => {
        return { ...e, color: getRandomColor("white"), status: "loaded" };
      }),
      {
        status: "loadMore",
        color: getRandomColor("white"),
        usersTotalMovieCount: res.value.totalRequestedMovieCount,
      },
    ] as cardTypesT[]);
  };

  const nextCard = () => {
    setCurrentCardIndex((pv) => {
      if (pv + 1 <= cards.length - 1) return pv + 1;
      else return pv;
    });
  };
  const previousCard = () => {
    setCurrentCardIndex((pv) => {
      if (pv - 1 >= 0) return pv - 1;
      else return pv;
    });
  };

  useEffect(() => {
    if (auth.user.status === "user" && ECDH.value.status === "loaded") {
      fetchAndSetMovies();
    } else {
      setCurrentCardIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user.status, ECDH.value.status]);

  return (
    <>
      <MultipleCards
        nextCard={nextCard}
        previousCard={previousCard}
        loadMovies={fetchAndSetMovies}
        cards={
          cardState === "loading"
            ? [{ status: "loading", color: defaultColor }]
            : cardState === "retry"
              ? [{ status: "retry", color: defaultColor }]
              : cardState === "loadingMovies"
                ? [{ status: "loadingMovies", color: defaultColor }]
                : cardState === "signIn"
                  ? [{ status: "signIn", color: defaultColor }]
                  : cards
        }
        currentCardIndex={currentCardIndex}
      ></MultipleCards>
    </>
  );
}
