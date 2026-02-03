import {is_vowel, is_consonant, remove_accents} from "../../letter.ts";
import {ACUTE, syllabify} from "../syllabify/syllabify.ts";

// only letter, not composed words
const validString = new RegExp("^[A-zÀ-ú]+$");

const exceptions = {
  // j)
  "compost": ["compost"],
  "karst": ["karst"],
  "test": ["test"],
  "trust": ["trust"],
  "kibutz": ["kibutz"],

  "lord": ["lores"],
  "milord": ["milores"],

  // h)
  "club": ["clubs", "clubes"],
  "imam": ["imames"],
  "álbum": ["álbumes"],
  
  // f) 
  "dux": ["dux"],

  // 2.1, se añaden como excepción al cambiar el acento.

  "espécimen": ["especímenes"],
  "régimen": ["regímenes"],
  "carácter": ["caracteres"],
};

export function to_plural(str: string): string[] {
  // console.log(str);

  const low = str.toLowerCase();

  if (Object.hasOwn(exceptions, str)) {
    // TODO same case
    return (exceptions as any)[low];
  }

  // console.log(str, str.match(validString))
  if (str.match(validString) == null) {
    throw new Error("invalid string");
  }

  // TODO not a name or adjetive
  if (low == "y") {
    throw new Error("not a name or adjetive");
  }


  const lastChar = low.charAt(str.length - 1);
  // a) Sustantivos y adjetivos terminados en vocal átona o en -e tónica
  if (["a", "e", "i", "o", "u", "é"].indexOf(lastChar) !== -1) {
    return [str + "s"];
  }
  // b) Sustantivos y adjetivos terminados en -a o en -o tónicas
  if (["á", "ó"].indexOf(lastChar) !== -1) {
    return [str + "s"];
  }
  // c) Sustantivos y adjetivos terminados en -i o en -u tónicas
  if (["í", "ú"].indexOf(lastChar) !== -1) {
    return [str + "s", str + "es"];
  }
  if (lastChar === "y") {
    // d) Sustantivos y adjetivos terminados en -y precedida de vocal
    const last2Char = low.charAt(str.length - 2);
    if (is_vowel(last2Char)) {
      return [str + "es"];
    }
  }
  // e) Voces extranjeras terminadas en -y precedida de consonante.
  if (lastChar === "y") {
    const last2Char = low.charAt(str.length - 2);
    if (is_consonant(last2Char)) {
      return [str.replace(/.$/, "is")];
    }
  }

  // f) Sustantivos y adjetivos terminados en -s o en -x.
  if (lastChar === "x" || lastChar === "s") {
    // Si son monosílabos o polisílabos agudos
    const syl = syllabify(str);
    //console.log(syl)
    //console.log(syl.syllables.length == 1)
    //console.log((syl.syllables.length > 1 && syl.acentuacion == AGUDA))
    if (syl.syllables.length == 1 || (syl.syllables.length > 1 && syl.accentuation == ACUTE)) {
      return [remove_accents(str + "es")];
    } else {
      return [str];
    }
  }

  // g) Sustantivos y adjetivos terminados en -l, -r, -n, -d, -z, -j.
  if (["l", "r", "n", "d", "z", "j"].indexOf(lastChar) !== -1) {
    // Si no van precedidas de otra consonante
    const last2Char = low.charAt(str.length - 2);
    if (!is_consonant(last2Char)) {
      if (lastChar == "z") {
        return [str.replace(/.$/, "ces")];
      }
      return [str + "es"];
    }
  }

  // h) Sustantivos y adjetivos terminados en consonantes distintas de -l, -r, -n, -d, -z, -j, -s, -x, -ch.
  //if (["l", "r", "n", "d", "z", "j", "s", "x"].indexOf(lastChar) === -1 && ("h" == lastChar && "c" != low.charAt(str.length - 2))) {
  if (["l", "r", "n", "d", "z", "j", "s", "x", "h"].indexOf(lastChar) === -1) {
      return [str + "s"];
  }

  // i) Sustantivos y adjetivos terminados en -ch.
  if ("h" == lastChar && "c" == low.charAt(str.length - 2)) {
    return [str + "es"];
  }

  // j) Sustantivos y adjetivos terminados en grupo consonántico.
  if (is_consonant(lastChar)) {
    const last2Char = low.charAt(str.length - 2);
    if (is_consonant(last2Char)) {
      return [str + "s"];
    }
  }

  throw new Error("unreachable");
}
