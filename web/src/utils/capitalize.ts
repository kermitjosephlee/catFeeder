import { capitalize as cap } from "lodash";

export const capitalize = (str: string): string => {
  const capitalizedWords = str.split(" ").map((word) => cap(word));
  return capitalizedWords.join(" ") ?? "";
};
