// based on https://github.com/nicofrem/silabajs/blob/c3f747bda7b32aa0e814fc0e41f59b8fbfe1a986/silabajs.js#L125
// but this version has many fixes and it's tested

import {
  is_closed_vowel,
  is_open_vowel,
  remove_accents,
  remove_diaeresis,
} from "../letter.ts";

export const HIATO_SIMPLE_TYPE_1 = "Hiato simple tipo 1";
export const HIATO_SIMPLE_TYPE_2 = "Hiato simple tipo 2";
export const HIATO_ACENTUAL = "Hiato acentual";

export interface Hiato {
  type:
    | typeof HIATO_SIMPLE_TYPE_1
    | typeof HIATO_SIMPLE_TYPE_2
    | typeof HIATO_ACENTUAL;
  syllable: string;
}

export const DIPHTHONG_CRESCENT = "Diptongo Creciente";
export const DIPHTHONG_DESCENDING = "Diptongo Decreciente";
export const DIPHTHONG_HOMOGENEOUS = "Diptongo Homogéneo";

// DIPHTHONGS
export interface Diphthong {
  type:
    | typeof DIPHTHONG_CRESCENT
    | typeof DIPHTHONG_DESCENDING
    | typeof DIPHTHONG_HOMOGENEOUS;
  syllable: string;
}
const TRIPHTHONG = "Triptongo";

// Triptongo
export interface Triphthong {
  type: typeof TRIPHTHONG;
  syllable: string;
}

export type PHONOLOGY_TYPE =
  | typeof HIATO_SIMPLE_TYPE_1
  | typeof HIATO_SIMPLE_TYPE_2
  | typeof HIATO_ACENTUAL
  | typeof DIPHTHONG_CRESCENT
  | typeof DIPHTHONG_DESCENDING
  | typeof DIPHTHONG_HOMOGENEOUS
  | typeof TRIPHTHONG;

// Aguda
export const ACUTE = "AGUDA";
// Lana o grave
export const PLAIN = "GRAVE";
// Esdrújula
export const PROSED = "Esdrújula";
// Sobresdrújula
export const OVERPROSED = "Sobresdrújula";

interface Syllable {
  idx: number;
  text: string;
  phonology: Hiato | Diphthong | Triphthong | null;
}

export interface WordSyllables {
  word: string;
  syllables: Syllable[];
  stressedSyllableIdx: number;
  accentedLetterIdx: number;
  accentuation:
    | typeof ACUTE
    | typeof PLAIN
    | typeof PROSED
    | typeof OVERPROSED;
}
/*

Monosílaba → una sola sílaba: mar, sol, el, un
Bisílaba → dos sílabas: calor, mano, árbol, libro...
Trisílaba → tres sílabas: repetir, orquesta, recoger...
Tetrasílaba → cuatro sílabas: chocolate, ferrocarril, constitución...
Polisílaba → cinco o más sílabas: computadora, conmemoración,...

Fuente: https://www.gramaticas.net/2014/07/fonetica-y-fonologia.html

*/

/**
 * Devuelve Objeto 'silaba' con los valores calculados
 */
export function syllabify(word: string): WordSyllables {
  word = word.toLowerCase().trim();

  // TODO whitelist "spanish" letters
  if (word.indexOf(" ") !== -1) {
    throw new Error("a word cannot contain spaces");
  }

  // Declaración de Variables
  const silaba: WordSyllables = {
    word,

    syllables: [],
    stressedSyllableIdx: -1,
    accentedLetterIdx: -1,
    accentuation: null as any, // just initialization
  };

  posicionSilabas(silaba);

  silaba.accentuation = [
    ACUTE,
    PLAIN,
    PROSED,
    OVERPROSED,
  ][silaba.syllables.length - silaba.stressedSyllableIdx] as any; // TODO why cast ?

  find_hiato(silaba);
  find_triptongo(silaba);
  find_diptongo(silaba);

  return silaba;
}

/*********************************************************/
/*********************************************************/
//                  MÉTODOS INTERNOS                     //
/*********************************************************/
/*********************************************************/

/**
 * Realiza cálculo de las sílabas
 *
 * @returns {undefined}
 */
function posicionSilabas(silaba: WordSyllables) {
  // Variable que almacena sílaba y la posición de la sílaba

  // Se recorre la palabra buscando las sílabas
  for (let actPos = 0; actPos < silaba.word.length;) {
    const start = actPos;
    // Las sílabas constan de tres partes: ataque, núcleo y coda
    actPos = onset(silaba, silaba.word, actPos);
    actPos = nucleus(silaba, silaba.word, actPos);
    actPos = coda(silaba, silaba.word, actPos);

    // Guarda sílaba de la palabra
    silaba.syllables.push({
      idx: start,
      phonology: null,
      text: silaba.word.substring(
        start,
        actPos,
      ),
    });
  }

  // Si no se ha encontrado la sílaba tónica (no hay tilde), se determina en base a
  // las reglas de acentuación
  if (silaba.stressedSyllableIdx == -1) {
    if (silaba.syllables.length < 2) {
      silaba.stressedSyllableIdx = silaba.syllables.length; // Monosílabos
    } else { // Polisílabos
      const letraFinal = silaba.word[silaba.word.length - 1];
      const letraAnterior = silaba.word[silaba.word.length - 2];

      if (
        (!esConsonante(letraFinal) || (letraFinal == "y")) ||
        ((letraFinal == "n") ||
          (letraFinal == "s") && !esConsonante(letraAnterior))
      ) {
        silaba.stressedSyllableIdx = silaba.syllables.length - 1; // Palabra llana
      } else {
        silaba.stressedSyllableIdx = silaba.syllables.length; // Palabra aguda
      }
    }
  }
}

/**
 * Determina el ataque de la silaba de pal que empieza en pos y avanza
 * pos hasta la posición siguiente al final de dicho ataque
 *
 * @returns {int}
 */
function onset(silaba: WordSyllables, pal: string, pos: number): number {
  // Se considera que todas las consonantes iniciales forman parte del ataque
  var ultimaConsonante = "a";

  while (
    (pos < silaba.word.length) &&
    ((esConsonante(pal[pos])) && (pal[pos] != "y"))
  ) {
    ultimaConsonante = pal[pos];
    pos++;
  }

  // (q | g) + u (ejemplo: queso, gueto)
  if (pos < silaba.word.length - 1) {
    if (pal[pos] == "u") {
      if (ultimaConsonante == "q") {
        pos++;
      } else if (ultimaConsonante == "g") {
        const letra = pal[pos + 1];
        if (
          (letra == "e") || (letra == "é") || (letra == "i") || (letra == "í")
        ) {
          pos++;
        }
      }
    } else { // La u con diéresis se añade a la consonante
      if ((pal[pos] === "ü") || (pal[pos] == "Ü")) {
        if (ultimaConsonante == "g") {
          pos++;
        }
      }
    }
  }

  return pos;
}

/**
 * Determina el núcleo de la sílaba de pal cuyo ataque termina en pos - 1
 * y avanza pos hasta la posición siguiente al final de dicho núcleo
 *
 * @param {string} pal
 * @param {int} pos
 * @returns {int}
 */
function nucleus(silaba: WordSyllables, pal: string, pos: number): number {
  // Sirve para saber el tipo de vocal anterior cuando hay dos seguidas
  let anterior = 0;
  let c;

  // 0 = fuerte
  // 1 = débil acentuada
  // 2 = débil

  if (pos >= silaba.word.length) {
    throw new Error("invalid call ?");
    return pos; // ¡¿No tiene núcleo?!
  }

  // Se salta una 'y' al principio del núcleo, considerándola consonante
  if (pal[pos] == "y") {
    pos++;
  }

  // Primera vocal
  if (pos < silaba.word.length) {
    c = pal[pos];
    switch (c) {
      // Vocal fuerte o débil acentuada
      case "á":
      case "Á":
      case "à":
      case "À":
      case "é":
      case "É":
      case "è":
      case "È":
      case "ó":
      case "Ó":
      case "ò":
      case "Ò":
        silaba.accentedLetterIdx = pos;
        silaba.stressedSyllableIdx = silaba.syllables.length + 1;
        anterior = 0;
        pos++;
        break;
      // Vocal fuerte
      case "a":
      case "A":
      case "e":
      case "E":
      case "o":
      case "O":
        anterior = 0;
        pos++;
        break;
      // Vocal débil acentuada, rompe cualquier posible diptongo
      case "í":
      case "Í":
      case "ì":
      case "Ì":
      case "ú":
      case "Ú":
      case "ù":
      case "Ù":
      case "ü":
      case "Ü":
        silaba.accentedLetterIdx = pos;
        anterior = 1;
        pos++;
        silaba.stressedSyllableIdx = silaba.syllables.length + 1;
        return pos;
      // Vocal débil
      case "i":
      case "I":
      case "u":
      case "U":
        anterior = 2;
        pos++;
        break;
    }
  }

  // 'h' intercalada en el núcleo, no condiciona diptongos o hiatos
  let hache = false;
  if (pos < silaba.word.length) {
    if (pal[pos] == "h") {
      pos++;
      hache = true;
    }
  }

  // Segunda vocal
  if (pos < silaba.word.length) {
    c = pal[pos];
    switch (c) {
      // Vocal fuerte o débil acentuada
      case "á":
      case "Á":
      case "à":
      case "À":
      case "é":
      case "É":
      case "è":
      case "È":
      case "ó":
      case "Ó":
      case "ò":
      case "Ò":
        silaba.accentedLetterIdx = pos;
        if (anterior != 0) {
          silaba.stressedSyllableIdx = silaba.syllables.length + 1;
        }
        if (anterior == 0) { // Dos vocales fuertes no forman sílaba
          if (hache) {
            pos--;
          }
          return pos;
        } else {
          pos++;
        }

        break;
      // Vocal fuerte
      case "a":
      case "A":
      case "e":
      case "E":
      case "o":
      case "O":
        if (anterior == 0) { // Dos vocales fuertes no forman sílaba
          if (hache) {
            pos--;
          }
          return pos;
        } else {
          pos++;
        }

        break;

      // Vocal débil acentuada, no puede haber triptongo, pero si diptongo
      case "í":
      case "Í":
      case "ì":
      case "Ì":
      case "ú":
      case "Ú":
      case "ù":
      case "Ù":
        silaba.accentedLetterIdx = pos;

        if (anterior != 0) { // Se forma diptongo
          silaba.stressedSyllableIdx = silaba.syllables.length + 1;
          pos++;
        } else if (hache) {
          pos--;
        }

        return pos;
      // Vocal débil
      case "i":
      case "I":
      case "u":
      case "U":
      case "ü":
      case "Ü":
        if (pos < silaba.word.length - 1) { // ¿Hay tercera vocal?
          const siguiente = pal[pos + 1];
          if (!esConsonante(siguiente)) {
            const letraAnterior = pal[pos - 1];
            if (letraAnterior == "h") {
              pos--;
            }
            return pos;
          }
        }

        // dos vocales débiles iguales no forman diptongo
        if (pal[pos] != pal[pos - 1]) {
          pos++;
        }

        // Es un diptongo plano o descendente
        return pos;
    }
  }

  // ¿tercera vocal?
  if (pos < silaba.word.length) {
    c = pal[pos];
    if ((c == "i") || (c == "u")) { // Vocal débil
      pos++;
      return pos; // Es un triptongo
    }
  }

  return pos;
}

/**
 * Determina la coda de la sílaba de pal cuyo núcleo termina en pos - 1
 * y avanza pos hasta la posición siguiente al final de dicha coda
 *
 * @param {string} pal
 * @param {int} pos
 * @returns {int}
 */
function coda(silaba: WordSyllables, pal: string, pos: number): number {
  if ((pos >= silaba.word.length) || (!esConsonante(pal[pos]))) {
    return pos; // No hay coda
  } else {
    if (pos == silaba.word.length - 1) { // Final de palabra
      pos++;
      return pos;
    }

    // Si sólo hay una consonante entre vocales, pertenece a la siguiente sílaba
    if (!esConsonante(pal[pos + 1])) return pos;

    const c1 = pal[pos];
    const c2 = pal[pos + 1];

    // ¿Existe posibilidad de una tercera consonante consecutiva?
    if ((pos < silaba.word.length - 2)) {
      const c3 = pal[pos + 2];

      if (!esConsonante(c3)) { // No hay tercera consonante
        // Los grupos ll, lh, ph, ch y rr comienzan sílaba

        if ((c1 == "l") && (c2 == "l")) {
          return pos;
        }
        if ((c1 == "c") && (c2 == "h")) {
          return pos;
        }
        if ((c1 == "r") && (c2 == "r")) {
          return pos;
        }

        ///////// grupos nh, sh, rh, hl son ajenos al español(DPD)
        if (
          (c1 != "s") && (c1 != "r") &&
          (c2 == "h")
        ) {
          return pos;
        }

        // Si la y está precedida por s, l, r, n o c (consonantes alveolares),
        // una nueva sílaba empieza en la consonante previa, si no, empieza en la y
        if ((c2 == "y")) {
          if (
            (c1 == "s") || (c1 == "l") || (c1 == "r") || (c1 == "n") ||
            (c1 == "c")
          ) {
            return pos;
          }

          pos++;
          return pos;
        }

        // gkbvpft + l
        if (
          (((c1 == "b") || (c1 == "v") || (c1 == "c") || (c1 == "k") ||
            (c1 == "f") || (c1 == "g") || (c1 == "p") || (c1 == "t")) &&
            (c2 == "l"))
        ) {
          return pos;
        }

        // gkdtbvpf + r

        if (
          (((c1 == "b") || (c1 == "v") || (c1 == "c") || (c1 == "d") ||
            (c1 == "k") ||
            (c1 == "f") || (c1 == "g") || (c1 == "p") || (c1 == "t")) &&
            (c2 == "r"))
        ) {
          return pos;
        }

        pos++;
        return pos;
      } else { // Hay tercera consonante
        if ((pos + 3) == silaba.word.length) { // Tres consonantes al final ¿palabras extranjeras?
          if ((c2 == "y")) { // 'y' funciona como vocal
            if (
              (c1 == "s") || (c1 == "l") || (c1 == "r") || (c1 == "n") ||
              (c1 == "c")
            ) {
              return pos;
            }
          }

          if (c3 == "y") { // 'y' final funciona como vocal con c2
            pos++;
          } else { // Tres consonantes al final ¿palabras extranjeras?
            pos += 3;
          }
          return pos;
        }

        if ((c2 == "y")) { // 'y' funciona como vocal
          if (
            (c1 == "s") || (c1 == "l") || (c1 == "r") || (c1 == "n") ||
            (c1 == "c")
          ) {
            return pos;
          }

          pos++;
          return pos;
        }

        // Los grupos pt, ct, cn, ps, mn, gn, ft, pn, cz, tz, ts comienzan sílaba (Bezos)

        if (
          (c2 == "p") && (c3 == "t") ||
          (c2 == "c") && (c3 == "t") ||
          (c2 == "c") && (c3 == "n") ||
          (c2 == "p") && (c3 == "s") ||
          (c2 == "m") && (c3 == "n") ||
          (c2 == "g") && (c3 == "n") ||
          (c2 == "f") && (c3 == "t") ||
          (c2 == "p") && (c3 == "n") ||
          (c2 == "c") && (c3 == "z") ||
          (c2 == "t") && (c3 == "z") ||
          (c2 == "t") && (c3 == "s")
        ) {
          pos++;
          return pos;
        }

        if (
          (c3 == "l") || (c3 == "r") || // Los grupos consonánticos formados por una consonante
          // seguida de 'l' o 'r' no pueden separarse y siempre inician
          // sílaba
          ((c2 == "c") && (c3 == "h")) || // 'ch'
          (c3 == "y")
        ) { // 'y' funciona como vocal
          pos++; // Siguiente sílaba empieza en c2
        } else {
          pos += 2; // c3 inicia la siguiente sílaba
        }
      }
    } else {
      if ((c2 == "y")) return pos;

      pos += 2; // La palabra acaba con dos consonantes
    }
  }
  return pos;
}

// https://www.rae.es/dpd/hiato
function find_hiato(silaba: WordSyllables) {
  for (let i = 0; i < silaba.syllables.length - 1; i++) {
    const syllable = silaba.syllables[i];
    if (syllable.phonology != null) {
      continue;
    }

    const c = silaba.syllables[i].text; // current syllable
    const n = silaba.syllables[i + 1].text; // next syllable

    const lc = c[c.length - 1]; // last character - current syllable
    let ln = n[0]; // first character - next syllable

    let text = lc + "-" + ln;

    if (ln == "h") { // h is ignored for hiato
      ln = n[1]; // first character - next syllable
      text += ln;
    }

    const lnc = lc + ln; // last letter

    // console.log("hiato", i, lnc, lnc2);
    // Fuente: https://www.gramaticas.net/2013/03/ejemplos-de-hiato.html
    switch (lnc) {
      case "aa":
      case "ae":
      case "ao":
      case "ea":
      case "ee":
      case "eo":
      case "oa":
      case "oe":
      case "oo":
        syllable.phonology = {
          type: HIATO_SIMPLE_TYPE_1,
          syllable: text,
        };
        break;
      case "uu":
      case "ii":
        syllable.phonology = {
          type: HIATO_SIMPLE_TYPE_2,
          syllable: text,
        };
        break;

      // Hiato simple acentuado
      case "aá":
      case "aé":
      case "aó":
      case "eá":
      case "eé":
      case "eó":
      case "oá":
      case "oé":
      case "oó":
      // Hiato Acentual: formado por una vocal cerrada (i, u) tónica (con tilde) y una vocal abierta (a, e, o) átona:
      case "aí":
      case "aú":
      case "eí":
      case "eú":
      case "oí":
      case "oú":
      case "ía":
      case "íe":
      case "ío":
      case "úa":
      case "úe":
      case "úo":
        syllable.phonology = {
          type: HIATO_ACENTUAL,
          syllable: text,
        };
    }
  }
}

// https://www.rae.es/dpd/diptongo
function find_diptongo(silaba: WordSyllables) {
  for (let i = 0; i < silaba.syllables.length; i++) {
    const syllable = silaba.syllables[i];
    if (syllable.phonology != null) {
      continue;
    }

    // if is enough but i would like to included it in the regex...
    if (
      syllable.text.indexOf("que") !== -1 || syllable.text.indexOf("qui") !== -1
    ) {
      continue;
    }

    // Diptongo Creciente (VD - VF) = ((i|u)(a|e|o))
    const m2 = syllable.text.match(/((i|u)(a|e|o))/g);
    if (m2 != null) {
      syllable.phonology = {
        type: DIPHTHONG_CRESCENT,
        syllable: m2[0],
      };
      continue;
    }

    // Diptongo Decreciente (VF - VD) : ((a|e|o)(i|u))
    const m3 = syllable.text.match(/((a|e|o)(i|u))/g);
    if (m3 != null) {
      syllable.phonology = {
        type: DIPHTHONG_DESCENDING,
        syllable: m3[0],
      };
      continue;
    }

    // Diptongo Homogéneo (VD - VD) : ((i|u)(i|u))
    const m4 = syllable.text.match(/((i|u)(i|u))/g);
    if (m4 != null) {
      syllable.phonology = {
        type: DIPHTHONG_HOMOGENEOUS,
        syllable: m4[0],
      };
    }
  }
}

// https://www.rae.es/dpd/triptongo
function find_triptongo(silaba: WordSyllables) {
  for (let i = 0; i < silaba.syllables.length; i++) {
    const syllable = silaba.syllables[i];
    // skip, only one phonology
    if (syllable.phonology != null) {
      continue;
    }

    // Triptongo (VD - VF - VD) = ((i|u)(a|e|o)(i|u))
    //const m = removeDiaeresis(removeAccents(syllable.text)).match(/((i|u)(a|e|o)(i|u|y))/g); // fix: iéi
    const regex = /((i|u)(a|e|o)(i|u|y))/g;
    const m = regex.exec(remove_diaeresis(remove_accents(syllable.text))); // fix: iéi
    if (m != null) {
      syllable.phonology = {
        type: TRIPHTHONG,
        syllable: syllable.text.substring(m.index, m.index + m[0].length),
      };
      continue;
    }
  }
}

/**
 * Determina si c es una vocal fuerte o débil acentuada
 */
function vocalFuerte(c: string): boolean {
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
 * Determina si c no es una vocal
 */
function esConsonante(c: string): boolean {
  if (!vocalFuerte(c)) {
    return !is_closed_vowel(c);
  }

  return false;
}
