// source: https://www.rae.es/dpd/hiato

// aka graphemas - las letras del alfabeto, lo que usamos para escribir.
export const ALPHABET = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "ñ",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

// la combinación de dos grafemas para representar un sólo sonido.
const DIGRAHPS = [
  "ch",
  "ll",
  "rr",
];

export const VOWELS_LIST = [
  "a",
  "e",
  "i",
  "o",
  "u",
];

export const FULL_VOWELS = [
  "a",
  "e",
  "i",
  "o",
  "u",
  "á",
  "é",
  "í",
  "ó",
  "ú",
  "ü",
];

export const CONSONANTS_LIST = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "ñ",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
];

/**
 * Vocal
 * @param char
 * @returns
 */
export function is_vowel(char: string): boolean {
  if (char.length != 1) {
    throw new Error("only one char is allowed");
  }
  return (char == "a" || char == "e" || char == "i" || char == "o" ||
    char == "u" || char == "A" || char == "E" || char == "I" || char == "O" ||
    char == "U" ||
    char == "á" || char == "é" || char == "í" || char == "ó" || char == "ú" ||
    char == "Á" || char == "É" || char == "Í" || char == "Ó" || char == "Ú" ||
    char == "ü" || char == "Ü");
}

export function is_consonant(char: string) {
  if (char.length != 1) {
    throw new Error("only one char is allowed");
  }

  const code = char.charCodeAt(0);
  //console.log(char, code)
  // ñ, Ñ, a-z not vowel, A-Z not vowel
  return code == 241 || code == 209 ||
    (code > 97 && code <= 127 && !is_vowel(char)) ||
    (code > 65 && code <= 90 && !is_vowel(char));
}

/**
 * Vocal fuerte / vocal abierta
 * @param char
 * @returns
 */
export function is_open_vowel(char: string) {
  if (char.length != 1) {
    throw new Error("only one char is allowed");
  }
  return char == "a" || char == "e" || char == "o" ||
    char == "A" || char == "E" || char == "O";
}

export function remove_diaeresis(word: string) {
  for (let i = 0; i < word.length; ++i) {
    switch (word[i]) {
      case "ü":
        word = word.substring(0, i) + "u" + word.substring(i + 1);
        break;
      case "Ü":
        word = word.substring(0, i) + "U" + word.substring(i + 1);
        break;
    }
  }
  return word;
}

export function remove_accents(word: string): string {
  for (let i = 0; i < word.length; ++i) {
    switch (word[i]) {
      case "á":
        word = word.substring(0, i) + "a" + word.substring(i + 1);
        break;
      case "Á":
        word = word.substring(0, i) + "A" + word.substring(i + 1);
        break;
      case "é":
        word = word.substring(0, i) + "e" + word.substring(i + 1);
        break;
      case "É":
        word = word.substring(0, i) + "E" + word.substring(i + 1);
        break;
      case "í":
        word = word.substring(0, i) + "i" + word.substring(i + 1);
        break;
      case "Í":
        word = word.substring(0, i) + "I" + word.substring(i + 1);
        break;
      case "ó":
        word = word.substring(0, i) + "o" + word.substring(i + 1);
        break;
      case "Ó":
        word = word.substring(0, i) + "O" + word.substring(i + 1);
        break;
      case "ú":
        word = word.substring(0, i) + "u" + word.substring(i + 1);
        break;
      case "Ú":
        word = word.substring(0, i) + "U" + word.substring(i + 1);
        break;
    }
  }
  return word;
}

export function is_strong_vowel(c: string) {
  if (c.length != 1) {
    throw new Error("only one char is allowed");
  }

  switch (c) {
    case "a":
    case "á":
    case "A":
    case "Á":
    case "à":
    case "À":
    case "e":
    case "é":
    case "E":
    case "É":
    case "è":
    case "È":
    case "í":
    case "Í":
    case "ì":
    case "Ì":
    case "o":
    case "ó":
    case "O":
    case "Ó":
    case "ò":
    case "Ò":
    case "ú":
    case "Ú":
    case "ù":
    case "Ù":
      return true;
  }
  return false;
}

/**
 * Vocal débil / vocal cerrada
 * @param char
 * @returns
 */
export function is_closed_vowel(char: string): boolean {
  if (char.length != 1) {
    throw new Error("only one char is allowed");
  }

  return char == "i" || char == "I" || char == "u" || char == "U" ||
    char == "ü" || char == "Ü";
}

// from: https://www.rae.es/dpd/hiato
export function is_unstressed_open_vowel(char: string): boolean {
  if (char.length != 1) {
    throw new Error("only one char is allowed");
  }

  return char == "a" || char == "e" || char == "o" || char == "A" ||
    char == "E" || char == "O";
}

export function is_stressed_closed_vowel(char: string): boolean {
  if (char.length != 1) {
    throw new Error("only one char is allowed");
  }

  return char == "í" || char == "ú" || char == "Í" || char == "Ú";
}
