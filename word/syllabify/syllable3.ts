// https://github.com/dimkir/cyrillizer/blob/407d22b495bdbadd067361a5a408acf0f739c9df/doc/SeparadorDeSilabas.cs#L9

// http://elies.rediris.es/elies4/Fon2.htm

import { errorMonitor } from "node:events";
import { is_closed_vowel, is_open_vowel, removeAccents, remove_diaeresis } from "../letter.ts";

export const HIATO_TYPE_1 = "Hiato simple tipo 1";
export const HIATO_TYPE_2 = "Hiato simple tipo 2";
export const HIATO_ACENTUAL = "Hiato acentual";

export interface Hiato {
  type: typeof HIATO_TYPE_1 | typeof  HIATO_TYPE_2 | typeof HIATO_ACENTUAL;
  syllable: string;
}

export const DIPTONGO_CREDIENTE = "Diptongo Creciente";
export const DIPTONGO_DECREDIENTE = "Diptongo Decreciente";
export const DIPTONGO_HOMOGENEO = "Diptongo Homogéneo";

export interface Diptongo {
  type: typeof DIPTONGO_CREDIENTE | typeof DIPTONGO_DECREDIENTE | typeof DIPTONGO_HOMOGENEO;
  syllable: string;
}
const TRIPTONGO = "Triptongo";

export interface Triptongo {
  type: typeof TRIPTONGO;
  syllable: string;
}

export const AGUDA = "AGUDA";
export const GRAVE = "GRAVE";
export const ESDRUJULA = "Esdrújula";
export const SOBREESDRUJULA = "Sobresdrújula";

interface Syllable {
  idx: number;
  text: string;
  phonology: Hiato | Diptongo | Triptongo | null;
}

export interface WordAnalysis {
  word: string;
  numeroSilaba: number;
  syllables: Syllable[];
  tonica: number;
  letraTildada: number;
  acentuacion: typeof AGUDA | typeof GRAVE | typeof ESDRUJULA | typeof SOBREESDRUJULA;
  
}
/*

Monosílaba → una sola sílaba: mar, sol, el, un
Bisílaba → dos sílabas: calor, mano, árbol, libro...
Trisílaba → tres sílabas: repetir, orquesta, recoger...
Tetrasílaba → cuatro sílabas: chocolate, ferrocarril, constitución...
Polisílaba → cinco o más sílabas: computadora, conmemoración,...

Fuente: https://www.gramaticas.net/2014/07/fonetica-y-fonologia.html

*/

var encontroTonica = undefined; // (bool)   Indica si se ha encontrado la sílaba tónica

/**
 * Devuelve Objeto 'silaba' con los valores calculados
 */
export function syllable(word: string): WordAnalysis {
  // TODO whitelist "spanish" letters
  if (word.indexOf(" ") !== -1) {
    throw new Error("a word cannot contain spaces");
  }

  // Declaración de Variables
  const silaba: WordAnalysis = {
    word: word.toLowerCase().trim(),
    numeroSilaba: 0,

    syllables: [],
    tonica: 0,
    letraTildada: -1,
    acentuacion: null as any, // just initialization
  };

  posicionSilabas(silaba, word);
  console.log("silaba!!", silaba);
  
  silaba.acentuacion = [AGUDA, GRAVE, ESDRUJULA, SOBREESDRUJULA][silaba.numeroSilaba - silaba.tonica] as any; // TODO why cast ?

  hiato(silaba);
  Triptongo(silaba);
  diptongo(silaba);

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
 * @param {string} palabra
 * @returns {undefined}
 */
function posicionSilabas(silaba: WordAnalysis, palabra: string) {
  encontroTonica = false;

  // Variable que almacena sílaba y la posición de la sílaba

  // Se recorre la palabra buscando las sílabas
  for (let actPos = 0; actPos < silaba.word.length;) {
    silaba.numeroSilaba++;
    const start = actPos;
    // Las sílabas constan de tres partes: ataque, núcleo y coda
    actPos = ataque(silaba, silaba.word, actPos);
    actPos = nucleo(silaba, silaba.word, actPos);
    actPos = coda(silaba, silaba.word, actPos);

    // Guarda sílaba de la palabra
    silaba.syllables.push({
      idx: start,
      phonology: null,
      text: silaba.word.substring(
        start,
        actPos,
    )});

    if (encontroTonica && (silaba.tonica == 0)) {
      silaba.tonica = silaba.numeroSilaba; // Marca la sílaba tónica
    }
  }

  // Si no se ha encontrado la sílaba tónica (no hay tilde), se determina en base a
  // las reglas de acentuación
  if (!encontroTonica) {
    if (silaba.numeroSilaba < 2) {
      silaba.tonica = silaba.numeroSilaba; // Monosílabos
    } else { // Polisílabos
      var letraFinal = silaba.word[silaba.word.length - 1];
      var letraAnterior = silaba.word[silaba.word.length - 2];

      if (
        (!esConsonante(letraFinal) || (letraFinal == "y")) ||
        ((letraFinal == "n") ||
          (letraFinal == "s") && !esConsonante(letraAnterior))
      ) {
        silaba.tonica = silaba.numeroSilaba - 1; // Palabra llana
      } else {
        silaba.tonica = silaba.numeroSilaba; // Palabra aguda
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
function ataque(silaba: WordAnalysis, pal: string, pos: number): number {
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
        var letra = pal[pos + 1];
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
function nucleo(silaba: WordAnalysis, pal: string, pos: number): number {
  // Sirve para saber el tipo de vocal anterior cuando hay dos seguidas
  var anterior = 0;
  var c;

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
        silaba.letraTildada = pos;
        encontroTonica = true;
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
        silaba.letraTildada = pos;
        anterior = 1;
        pos++;
        encontroTonica = true;
        return pos;
        break;
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
  var hache = false;
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
        silaba.letraTildada = pos;
        if (anterior != 0) {
          encontroTonica = true;
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
        silaba.letraTildada = pos;

        if (anterior != 0) { // Se forma diptongo
          encontroTonica = true;
          pos++;
        } else if (hache) {
          pos--;
        }

        return pos;

        break;
      // Vocal débil
      case "i":
      case "I":
      case "u":
      case "U":
      case "ü":
      case "Ü":
        if (pos < silaba.word.length - 1) { // ¿Hay tercera vocal?
          var siguiente = pal[pos + 1];
          if (!esConsonante(siguiente)) {
            var letraAnterior = pal[pos - 1];
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
function coda(silaba: WordAnalysis, pal: string, pos: number): number {
  if ((pos >= silaba.word.length) || (!esConsonante(pal[pos]))) {
    return pos; // No hay coda
  } else {
    if (pos == silaba.word.length - 1) { // Final de palabra
      pos++;
      return pos;
    }

    // Si sólo hay una consonante entre vocales, pertenece a la siguiente sílaba
    if (!esConsonante(pal[pos + 1])) return pos;

    var c1 = pal[pos];
    var c2 = pal[pos + 1];

    // ¿Existe posibilidad de una tercera consonante consecutiva?
    if ((pos < silaba.word.length - 2)) {
      var c3 = pal[pos + 2];

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

/**
 * Determina si se forma hiato/s
 *
 * @returns {undefined}
 */
function hiato(silaba: WordAnalysis) {
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
      text+=ln
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
          type: HIATO_TYPE_1,
          syllable: text,
        };
        break;
      case "uu":
      case "ii":
        syllable.phonology = {
          type: HIATO_TYPE_2,
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

/**
 * Determina si se forma triptongo/s y diptongo/s
 *
 * @returns {undefined}
 */
function diptongo(silaba: WordAnalysis) {
  // Vocal Débil = VD
  // Vocal Fuerte = VF

  for (let i = 0; i < silaba.syllables.length; i++) {
    console.log(i, silaba.syllables[i]);

    const syllable = silaba.syllables[i];
    if (syllable.phonology != null) {
      continue;
    }

    // Diptongo Creciente (VD - VF) = ((i|u)(a|e|o))
    const m2 = syllable.text.match(/((i|u)(a|e|o))/g);
    if (m2 != null) {
      syllable.phonology = {
        type: "Diptongo Creciente",
        syllable: m2[0],
      };
      continue;
    }

    // Diptongo Decreciente (VF - VD) : ((a|e|o)(i|u))
    const m3 = syllable.text.match(/((a|e|o)(i|u))/g);
    if (m3 != null) {
      syllable.phonology = {
        type: "Diptongo Decreciente",
        syllable: m3[0],
      };
      continue;
    }

    // Diptongo Homogéneo (VD - VD) : ((i|u)(i|u))
    const m4 = syllable.text.match(/((i|u)(i|u))/g);
    if (m4 != null) {
      syllable.phonology = {
        type: "Diptongo Homogéneo",
        syllable: m4[0],
      };
    }
  }
}

/**
 * Determina si se forma triptongo/s
 *
 * @returns {undefined}
 */
function Triptongo(silaba: WordAnalysis) {
  // Vocal Débil = VD
  // Vocal Fuerte = VF

  for (let i = 0; i < silaba.syllables.length; i++) {
    console.log(i, silaba.syllables[i]);

    const syllable = silaba.syllables[i];
    if (syllable.phonology != null) {
      continue;
    }

    // Triptongo (VD - VF - VD) = ((i|u)(a|e|o)(i|u))
    //const m = removeDiaeresis(removeAccents(syllable.text)).match(/((i|u)(a|e|o)(i|u|y))/g); // fix: iéi
    const regex = /((i|u)(a|e|o)(i|u|y))/g
    const m = regex.exec(remove_diaeresis(removeAccents(syllable.text))); // fix: iéi
    if (m != null) {
      console.log("at - > ", m.index)
      syllable.phonology = {
        type: TRIPTONGO,
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
    switch (c) {
      // Vocal débil
      case "i":
      case "I":
      case "u":
      case "U":
      case "ü":
      case "Ü":
        return false;
    }

    return true;
  }

  return false;
}
