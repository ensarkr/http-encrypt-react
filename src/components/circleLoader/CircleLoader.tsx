import styles from "./circleLoader.module.css";

/*
Renders circle loading animation
Default height is 100%
*/

export default function CircleLoader({
  color,
  height,
}: {
  color: string;
  height?: string;
}) {
  return (
    <div
      className={styles.loader}
      style={{
        ...{ borderRightColor: color },
        ...(height === undefined ? {} : { height }),
      }}
    ></div>
  );
}
