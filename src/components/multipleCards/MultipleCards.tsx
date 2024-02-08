import styles from "./multipleCards.module.css";
import { useEffect } from "react";
import { cardTypesT } from "../../routes";
import CardSwitch from "../cardSwitch/CardSwitch";

export default function MultipleCards({
  nextCard,
  previousCard,
  currentCardIndex,
  loadMovies,
  cards,
}: {
  nextCard: () => void;
  previousCard: () => void;
  currentCardIndex: number;
  loadMovies: () => void;
  cards: cardTypesT[];
}) {
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const removeTransition = () => {
      const root = document.querySelector(":root") as HTMLDivElement;
      root.style.setProperty("--movie-card-transition-duration", "0");

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        root.style.setProperty("--movie-card-transition-duration", "200ms");
      }, 500);
    };

    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    const checkDirection = () => {
      const swipeDetectionRangePX = 60;
      const swipeYUnDetectionRangePX = 60;

      if (Math.abs(touchendY - touchstartY) > swipeYUnDetectionRangePX) return;

      if (touchendX < touchstartX - swipeDetectionRangePX) nextCard();
      if (touchendX > touchstartX + swipeDetectionRangePX) previousCard();
    };

    const touchStart = (e: TouchEvent) => {
      touchstartX = e.changedTouches[0].screenX;
      touchstartY = e.changedTouches[0].screenY;
    };
    const touchEnd = (e: TouchEvent) => {
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;
      checkDirection();
    };

    document.addEventListener("touchstart", touchStart);
    document.addEventListener("touchend", touchEnd);
    window.addEventListener("resize", removeTransition);
    return () => {
      window.removeEventListener("resize", removeTransition);
      document.removeEventListener("touchstart", touchStart);
      document.removeEventListener("touchend", touchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  return (
    <div className={styles.main}>
      {cards.length > 1 && (
        <>
          {currentCardIndex !== 0 && (
            <button
              className={styles.leftButton}
              onClick={previousCard}
            ></button>
          )}
          {currentCardIndex !== cards.length - 1 && (
            <button className={styles.rightButton} onClick={nextCard}></button>
          )}
        </>
      )}

      <div className={styles.backgrounds}>
        {cards.map((e, i) => (
          <div
            key={i}
            className={styles.movieDetailsWrapper}
            style={getElementStyle(currentCardIndex, i, e.color)}
          >
            <CardSwitch
              isItCurrent={i == currentCardIndex}
              loadMovies={loadMovies}
              card={e}
            ></CardSwitch>
          </div>
        ))}
      </div>
    </div>
  );
}

function getElementStyle(
  currentCardIndex: number,
  elementsIndex: number,
  borderColor: string
): React.CSSProperties {
  const dif = currentCardIndex - elementsIndex;
  const elementShift = 50;
  const elementTop = 15;
  const scaleRatio = 15;

  if (dif > 0) {
    return {
      userSelect: "none",
      pointerEvents: "none",
      borderColor: "black",
      zIndex: -dif,
      filter: "blur(5px)",
      transform: `translate3d(calc(-${elementsIndex} * var(--movie-card-width) + ${-dif * elementShift}px ), ${dif * elementTop}px, 0px) rotateZ(0deg) scale(${1 - dif / scaleRatio})`,
    };
  }

  if (dif < 0) {
    return {
      userSelect: "none",
      pointerEvents: "none",
      borderColor,
      zIndex: dif - 50,
      filter: "blur(5px)",
      transform: `translate3d(calc(-${elementsIndex} * var(--movie-card-width) + ${-dif * elementShift}px ), ${-dif * elementTop}px, 0px) rotateZ(0deg) scale(${1 + dif / scaleRatio})`,
    };
  }

  return {
    borderColor,
    zIndex: 0,
    transform: `translate3d(calc(-${elementsIndex} * var(--movie-card-width) + 0px ), 0px, 0px) rotateZ(0deg) scale(1)`,
  };
}
