function getRandomColor(adaptingTextColor: "black" | "white") {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    const hexcolor = randomColor;
    const r = parseInt(hexcolor.slice(0, 2), 16);
    const g = parseInt(hexcolor.slice(2, 4), 16);
    const b = parseInt(hexcolor.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    if (adaptingTextColor === "black" && yiq >= 128) return "#" + hexcolor;
    if (adaptingTextColor === "white" && yiq < 128) return "#" + hexcolor;
  }
}

export { getRandomColor };
