import { ReactNode, memo } from "react";
import { movieDetailT } from "../../typings/tmdb";
import styles from "./cardSwitch.module.css";
import { cardTypesT } from "../../routes";
import CustomButton from "../customButton/CustomButton";
import CircleLoader from "../circleLoader/CircleLoader";
import { useNavigate } from "@tanstack/react-router";

const MovieCard_MEMO = memo(MovieCard);

export default function CardSwitch({
  card,
  loadMovies,
  isItCurrent,
}: {
  card: cardTypesT;
  loadMovies: () => void;
  isItCurrent: boolean;
}) {
  const navigate = useNavigate();

  switch (card.status) {
    case "loaded":
      return (
        <MovieCard_MEMO
          isItCurrent={isItCurrent}
          movieDetails={card}
          key={card.id}
        ></MovieCard_MEMO>
      );
    case "signIn":
      return (
        <EmptyCenteredCard>
          <div className={styles.centeredDiv}>
            <h2>( ≧Д≦)</h2>
            <h3>You have to sign in to see movies.</h3>
            <CustomButton
              onClick={() => {
                navigate({ to: "/auth/SignIn" });
              }}
              secondaryColor={card.color}
              title="SIGN IN"
              state="clickable"
            ></CustomButton>
          </div>
        </EmptyCenteredCard>
      );
    case "retry":
      return (
        <EmptyCenteredCard>
          <div className={styles.centeredDiv}>
            <h2>ヽ(ﾟДﾟ)ﾉ</h2>
            <h3>Error occurred.</h3>
            <CustomButton
              onClick={loadMovies}
              secondaryColor={card.color}
              title="RETRY"
              state="clickable"
            ></CustomButton>
          </div>
        </EmptyCenteredCard>
      );
    case "loading":
      return (
        <EmptyCenteredCard>
          <div className={styles.centeredDiv}>
            <h2>∩(´∀`∩)</h2>
            <h3>Please wait.</h3>
            <CircleLoader color={card.color} height="2rem"></CircleLoader>
          </div>
        </EmptyCenteredCard>
      );
    case "loadingMovies":
      return (
        <EmptyCenteredCard>
          <div className={styles.centeredDiv}>
            <h2>∩(´∀`∩)</h2>
            <h3>Loading the best movies for you.</h3>
            <CircleLoader color={card.color} height="2rem"></CircleLoader>
          </div>
        </EmptyCenteredCard>
      );
    case "loadMore":
      return (
        <EmptyCenteredCard>
          <div className={styles.centeredDiv}>
            <h2>＼（^０＾）／</h2>

            {card.usersTotalMovieCount !== null ? (
              <h3>
                You have totally looked {` ${card.usersTotalMovieCount} `}{" "}
                movies.
              </h3>
            ) : (
              <h3>You have looked every movie.</h3>
            )}
            <CustomButton
              onClick={loadMovies}
              secondaryColor={card.color}
              title="LOAD MORE"
              state="clickable"
            ></CustomButton>
          </div>
        </EmptyCenteredCard>
      );
  }
}

export function MovieCard({
  movieDetails,
  isItCurrent,
}: {
  movieDetails: movieDetailT & { status: "loaded"; color: string };
  isItCurrent: boolean;
}) {
  const getCurrentVideoLink = () => {
    const trailers = movieDetails.videos.filter((e) =>
      e.name.toLowerCase().includes("trailer")
    );

    if (trailers.length > 0) {
      return `https://www.youtube.com/embed/${trailers[0].key}`;
    } else {
      return `https://www.youtube.com/embed/${movieDetails.videos[0].key}`;
    }
  };

  const bottomBorderStyle = isItCurrent
    ? { borderBottom: `1px solid ${movieDetails.color}` }
    : {};

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <img
          className={styles.image}
          src={`https://image.tmdb.org/t/p/w500/${movieDetails.posterPath}`}
        ></img>
        <div className={styles.titles}>
          <h1 className={styles.title}>{movieDetails.title}</h1>
          <p className={styles.text}>{movieDetails.releaseDate}</p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 28.5"
              style={{
                fill: "rgba(255, 255, 255, 1)",
                verticalAlign: "bottom",
              }}
            >
              <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
            </svg>
            {movieDetails.voteAverage.toString().slice(0, 3)}
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 28.5"
              style={{
                fill: "rgba(255, 255, 255, 1)",
                verticalAlign: "bottom",
              }}
            >
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-.899.156-1.762.431-2.569L6 11l2 2v2l2 2 1 1v1.931C7.061 19.436 4 16.072 4 12zm14.33 4.873C17.677 16.347 16.687 16 16 16v-1a2 2 0 0 0-2-2h-4v-3a2 2 0 0 0 2-2V7h1a2 2 0 0 0 2-2v-.411C17.928 5.778 20 8.65 20 12a7.947 7.947 0 0 1-1.67 4.873z"></path>
            </svg>
            {movieDetails.popularity}
          </p>
          {movieDetails.genres.length > 0 && (
            <p>
              {movieDetails.genres.map(
                (e, i) =>
                  e + (movieDetails.genres.length - 1 !== i ? " - " : "")
              )}
            </p>
          )}
        </div>
      </div>
      <div className={styles.body}>
        {movieDetails.overview !== null && movieDetails.overview.length > 0 && (
          <>
            <h2 className={styles.subTitle} style={bottomBorderStyle}>
              Overview
            </h2>
            <p className={styles.text}>{movieDetails.overview}</p>
          </>
        )}
        {movieDetails.videos.length > 0 && (
          <>
            <h2 className={styles.subTitle} style={bottomBorderStyle}>
              Trailer
            </h2>
            <div className={styles.trailer}>
              {isItCurrent && (
                <iframe
                  allow="fullscreen;"
                  height={"100%"}
                  width={"100%"}
                  src={getCurrentVideoLink() as string}
                ></iframe>
              )}
            </div>
          </>
        )}
        {movieDetails.cast.length > 0 && (
          <>
            <h2 className={styles.subTitle} style={bottomBorderStyle}>
              Cast
            </h2>
            <ul>
              {movieDetails.cast.slice(0, 8).map((e, i) => (
                <li key={i}>
                  {e.name}{" "}
                  {e.character !== undefined &&
                    e.character.length > 0 &&
                    " - " + e.character}
                  {e.department !== undefined &&
                    e.department.length > 0 &&
                    " - " + e.department}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export function EmptyCenteredCard({ children }: { children?: ReactNode }) {
  return (
    <div className={[styles.main, styles.centeredCard].join(" ")}>
      {children}
    </div>
  );
}
